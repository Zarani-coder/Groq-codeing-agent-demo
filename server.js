const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const config = require('./config');

const app = express();

// Middleware
app.use(cors({
  origin: config.server.corsOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Initialize Groq API client
const groqClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.api.apiKey}`,
    'Content-Type': 'application/json'
  },
  timeout: config.api.timeout
});

// Helper function to call Groq API
async function callGroqAPI(messages, configType = 'generation') {
  try {
    const apiConfig = config[configType];
    const response = await groqClient.post('/chat/completions', {
      model: config.api.model,
      messages: messages,
      max_tokens: apiConfig.maxTokens,
      temperature: apiConfig.temperature,
      top_p: apiConfig.topP
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error(`Groq API Error: ${error.response?.data?.error?.message || error.message}`);
  }
}

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Generate code endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Generating code for: ${prompt}`);

    const messages = [
      {
        role: 'system',
        content: config.generation.systemPrompt
      },
      {
        role: 'user',
        content: `Generate ${language} code for: ${prompt}`
      }
    ];

    const generatedCode = await callGroqAPI(messages, 'generation');

    res.json({
      success: true,
      stage: 'generation',
      code: generatedCode,
      language: language
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Code generation failed', 
      message: error.message 
    });
  }
});

// Review code endpoint
app.post('/api/review', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log(`Reviewing code...`);

    const messages = [
      {
        role: 'system',
        content: config.review.systemPrompt
      },
      {
        role: 'user',
        content: `Review this ${language} code and provide feedback:\n\n${code}`
      }
    ];

    const review = await callGroqAPI(messages, 'review');

    res.json({
      success: true,
      stage: 'review',
      feedback: review,
      language: language
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ 
      error: 'Code review failed', 
      message: error.message 
    });
  }
});

// Refine code endpoint
app.post('/api/refine', async (req, res) => {
  try {
    const { code, feedback, language = 'javascript', round = 1 } = req.body;

    if (!code || !feedback) {
      return res.status(400).json({ error: 'Code and feedback are required' });
    }

    if (round > config.refinement.maxRounds) {
      return res.status(400).json({ 
        error: `Maximum refinement rounds (${config.refinement.maxRounds}) exceeded` 
      });
    }

    console.log(`Refining code - Round ${round}...`);

    const messages = [
      {
        role: 'system',
        content: config.refinement.systemPrompt
      },
      {
        role: 'user',
        content: `Original ${language} code:\n\n${code}\n\nFeedback to address:\n${feedback}\n\nProvide refined code that addresses all feedback.`
      }
    ];

    const refinedCode = await callGroqAPI(messages, 'refinement');

    res.json({
      success: true,
      stage: 'refinement',
      round: round,
      refinedCode: refinedCode,
      language: language
    });
  } catch (error) {
    console.error('Refinement error:', error);
    res.status(500).json({ 
      error: 'Code refinement failed', 
      message: error.message 
    });
  }
});

// Full workflow endpoint
app.post('/api/workflow', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Starting full workflow for: ${prompt}`);

    const workflow = {
      prompt: prompt,
      language: language,
      stages: []
    };

    // Stage 1: Generation
    console.log('Stage 1: Generating code...');
    const generationMessages = [
      {
        role: 'system',
        content: config.generation.systemPrompt
      },
      {
        role: 'user',
        content: `Generate ${language} code for: ${prompt}`
      }
    ];
    const generatedCode = await callGroqAPI(generationMessages, 'generation');
    workflow.stages.push({
      name: 'generation',
      code: generatedCode
    });

    // Stage 2: Review
    console.log('Stage 2: Reviewing generated code...');
    const reviewMessages = [
      {
        role: 'system',
        content: config.review.systemPrompt
      },
      {
        role: 'user',
        content: `Review this ${language} code and provide feedback:\n\n${generatedCode}`
      }
    ];
    const review = await callGroqAPI(reviewMessages, 'review');
    workflow.stages.push({
      name: 'review',
      feedback: review
    });

    // Stage 3: Refinement
    console.log('Stage 3: Refining code based on feedback...');
    const refinementMessages = [
      {
        role: 'system',
        content: config.refinement.systemPrompt
      },
      {
        role: 'user',
        content: `Original ${language} code:\n\n${generatedCode}\n\nFeedback to address:\n${review}\n\nProvide refined code that addresses all feedback.`
      }
    ];
    const refinedCode = await callGroqAPI(refinementMessages, 'refinement');
    workflow.stages.push({
      name: 'refinement',
      code: refinedCode
    });

    workflow.completed = true;
    res.json({
      success: true,
      workflow: workflow
    });
  } catch (error) {
    console.error('Workflow error:', error);
    res.status(500).json({ 
      error: 'Workflow failed', 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
const PORT = config.server.port;
const HOST = config.server.host;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Groq Coding Agent Server running at http://${HOST}:${PORT}`);
  console.log(`📝 API Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`🤖 Using model: ${config.api.model}`);
});

module.exports = app;
