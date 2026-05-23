// Configuration file for Groq Coding Agent Demo

module.exports = {
  // API Configuration
  api: {
    baseUrl: process.env.GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
    timeout: 30000
  },

  // Code Generation Configuration
  generation: {
    maxTokens: 2048,
    temperature: 0.7,
    topP: 1,
    systemPrompt: `You are an expert AI coding assistant. Generate clean, well-documented, and production-ready code.
    Follow best practices and conventions for the requested programming language.
    Include comments explaining key logic.`
  },

  // Code Review Configuration
  review: {
    maxTokens: 1024,
    temperature: 0.5,
    topP: 0.9,
    systemPrompt: `You are an expert code reviewer. Analyze the provided code and provide constructive feedback on:
    - Code quality and readability
    - Performance and efficiency
    - Security concerns
    - Best practices and conventions
    - Potential bugs or edge cases`
  },

  // Refinement Configuration
  refinement: {
    maxTokens: 2048,
    temperature: 0.6,
    topP: 0.95,
    maxRounds: 3,
    systemPrompt: `You are an expert code refactorer. Improve the provided code based on the feedback.
    Maintain functionality while enhancing quality, performance, and maintainability.`
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json'
  }
};
