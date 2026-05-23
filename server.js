const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const config = require('./config');

const app = express();

// Middleware
app.use(cors({ origin: config.server.corsOrigin }));
app.use(express.json());
app.use(express.static('public'));

// Logger utility
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`)
};

// Groq API client
const groqClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Authorization': `Bearer ${config.api.apiKey}`,
    'Content-Type': 'application/json'
  },
  timeout: config.api.timeout
});

// Helper function to call Groq API
async function callGroqAPI(systemPrompt, userPrompt, maxTokens, temperature) {
  try {
    const response = await groqClient.post('/chat/completions', {
      model: config.api.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error(`Groq API Error: ${error.message}`);
    throw new Error('Failed to call Groq API');
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Groq Coding Agent is running' });
});

// Generate code endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    logger.info(`Generating code for prompt: ${prompt.substring(0, 50)}...`);
    
    const generatedCode = await callGroqAPI(
      config.generation.systemPrompt,
      prompt,
      config.generation.maxTokens,
      config.generation.temperature
    );

    res.json({
      success: true,
      prompt,
      generatedCode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Review code endpoint
app.post('/api/review', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    logger.info('Reviewing code...');
    
    const review = await callGroqAPI(
      config.review.systemPrompt,
      `Please review the following code:\n\n${code}`,
      config.review.maxTokens,
      config.review.temperature
    );

    res.json({
      success: true,
      review,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Refine code endpoint
app.post('/api/refine', async (req, res) => {
  try {
    const { code, feedback } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    logger.info('Refining code...');
    
    const refinedCode = await callGroqAPI(
      config.refinement.systemPrompt,
      `Please refine the following code based on this feedback:\n\nFeedback: ${feedback || 'Improve overall quality and best practices'}\n\nCode:\n${code}`,
      config.refinement.maxTokens,
      config.refinement.temperature
    );

    res.json({
      success: true,
      refinedCode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Full workflow endpoint (generate -> review -> refine)
app.post('/api/workflow', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    logger.info('Starting full workflow...');
    
    const workflow = {
      prompt,
      steps: []
    };

    // Step 1: Generate
    logger.info('Step 1: Generating code...');
    const generatedCode = await callGroqAPI(
      config.generation.systemPrompt,
      prompt,
      config.generation.maxTokens,
      config.generation.temperature
    );
    workflow.steps.push({
      name: 'generation',
      result: generatedCode,
      timestamp: new Date().toISOString()
    });

    // Step 2: Review
    logger.info('Step 2: Reviewing code...');
    const review = await callGroqAPI(
      config.review.systemPrompt,
      `Please review the following code:\n\n${generatedCode}`,
      config.review.maxTokens,
      config.review.temperature
    );
    workflow.steps.push({
      name: 'review',
      result: review,
      timestamp: new Date().toISOString()
    });

    // Step 3: Refine (up to maxRounds times)
    for (let i = 0; i < config.refinement.maxRounds; i++) {
      logger.info(`Step 3.${i + 1}: Refining code...`);
      const refinedCode = await callGroqAPI(
        config.refinement.systemPrompt,
        `Please refine the following code based on this review:\n\nReview:\n${review}\n\nCode:\n${workflow.steps[workflow.steps.length - 1].result}`,
        config.refinement.maxTokens,
        config.refinement.temperature
      );
      workflow.steps.push({
        name: `refinement_${i + 1}`,
        result: refinedCode,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      workflow,
      finalCode: workflow.steps[workflow.steps.length - 1].result
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`🚀 Groq Coding Agent Server running on http://${config.server.host}:${PORT}`);
  logger.info(`📝 API Documentation available at http://${config.server.host}:${PORT}/api/docs`);
});

module.exports = app;
