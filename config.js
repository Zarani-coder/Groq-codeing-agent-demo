// Groq Coding Agent Configuration

module.exports = {
  // API Configuration
  api: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    groqApiUrl: 'https://api.groq.com/openai/v1',
    timeout: 30000, // 30 seconds
  },

  // Code Generation Settings
  codeGeneration: {
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
  },

  // Code Review Settings
  codeReview: {
    model: 'mixtral-8x7b-32768',
    temperature: 0.3,
    maxTokens: 1024,
    topP: 0.9,
  },

  // Refinement Settings
  refinement: {
    maxRounds: 3,
    model: 'mixtral-8x7b-32768',
    temperature: 0.5,
    maxTokens: 1024,
  },

  // Agent Workflow
  workflow: {
    enableReview: true,
    enableRefinement: true,
    showSteps: true,
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: 'localhost',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: false,
  },
};
