# 🚀 Groq Coding Agent - Complete Setup Guide

Welcome to the **Groq Coding Agent Demo**! This guide will walk you through everything you need to get started, whether you're coding on a **phone with Termux** or a **regular computer**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Agent](#running-the-agent)
5. [Using Claude Sonnet for Development](#using-claude-sonnet-for-development)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## 📱 Prerequisites

You need:
- ✅ **Node.js** (v16+)
- ✅ **npm** or **yarn**
- ✅ **Groq API Key** (free from [console.groq.com](https://console.groq.com))
- ✅ **Git** (for version control)

### For Mobile Development (Termux):
- ✅ **Termux** app from PlayStore
- ✅ **Proot-distro** (Linux on Android)
- ✅ **Node.js** installed via Termux

---

## ⚙️ Installation

### Option 1: Regular Computer

```bash
# Clone the repository
git clone https://github.com/Yuri-code-dot/Groq-codeing-agent-demo.git
cd Groq-codeing-agent-demo

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Option 2: Mobile (Termux)

```bash
# Update Termux packages
pkg update && pkg upgrade -y

# Install Node.js
pkg install nodejs -y

# Install Git
pkg install git -y

# Clone repository
git clone https://github.com/Yuri-code-dot/Groq-codeing-agent-demo.git
cd Groq-codeing-agent-demo

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

---

## 🔑 Configuration

### Step 1: Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (it's FREE forever!)
3. Go to API Keys
4. Create a new API key
5. Copy your key

### Step 2: Setup .env File

Edit the `.env` file:

```env
GROQ_API_KEY=your_api_key_here
MODEL=mixtral-8x7b-32768
HOST=localhost
PORT=3000
```

**Models Available (all FREE):**
- `mixtral-8x7b-32768` - Fast & powerful ⚡
- `llama-2-70b-chat` - Advanced reasoning 🧠
- `gemma-7b-it` - Lightweight & quick 🚀

---

## 🤖 Running the Agent

### Start the Server

```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:3000
✅ Ready to accept requests
```

### Test the Agent

Open another terminal (or Termux session):

```bash
curl http://localhost:3000/api/agent \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Generate a simple Hello World function"}'
```

Expected response:
```json
{
  "status": "success",
  "code": "function helloWorld() { console.log('Hello World'); }",
  "review": "Clean and simple implementation",
  "refinement": "Consider adding JSDoc comments"
}
```

---

## 💡 Using Claude Sonnet for Development

### Why Claude Sonnet?

- ⚡ **Fastest** inference (perfect for mobile)
- 🧠 **Smart enough** for complex tasks
- 💚 **FREE** tier available on PlayStore
- 🚀 Production-ready performance

### Using Claude App

1. **Download**: Claude app from PlayStore (free)
2. **Use for**: Code generation, debugging, documentation
3. **Prompt Template**:

```
You are a coding assistant helping with a Groq AI agent project.

Task: [Your task here]

Context:
- Framework: Node.js + Express
- AI: Groq API (free)
- Deployment: Railway/Vercel

Please provide:
1. Code solution
2. Explanation
3. Edge cases to consider
```

### Example Prompts for Claude

**Generate API endpoint:**
```
Generate a Node.js Express endpoint that:
- Accepts a JavaScript code snippet
- Uses Groq API to review it
- Returns structured feedback
- Handles errors gracefully
```

**Debug issues:**
```
My Groq API call is timing out after 30 seconds.
I'm running on Termux (mobile).
How do I fix this?
```

**Create documentation:**
```
Write deployment instructions for:
- Railway hosting
- Environment variables
- Zero-cost setup
- Mobile development (Termux)
```

---

## 🚀 Deployment Guide

### Deploy to Railway (Recommended - FREE tier)

1. **Sign up**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link your repo
3. **Set Environment Variables**:
   - `GROQ_API_KEY` = your key
   - `NODE_ENV` = production

4. **Deploy**:
   ```bash
   # Railway auto-detects Node.js
   # Just push to GitHub and it deploys!
   git push origin main
   ```

### Deploy to Vercel

1. **Sign up**: [vercel.com](https://vercel.com)
2. **Import GitHub repo**
3. **Set environment variables**
4. **Deploy** - instant ✅

### Deploy to Netlify

1. **Sign up**: [netlify.com](https://netlify.com)
2. **Connect GitHub**
3. **Build command**: `npm run build`
4. **Deploy** - automatic ✅

---

## 🔧 Project Structure

```
Groq-codeing-agent-demo/
├── server.js              # Main server
├── config.js              # Configuration
├── package.json           # Dependencies
├── .env.example           # Environment template
├── README.md              # Quick start
├── GUIDE.md               # This file!
├── LICENSE                # MIT License
└── .gitignore             # Git ignore rules
```

---

## 🆘 Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install
npm install express
```

### Issue: "GROQ_API_KEY not found"

**Solution:**
```bash
# Make sure .env file exists
cp .env.example .env

# Add your key
echo "GROQ_API_KEY=your_key_here" >> .env
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm start

# Or kill the process
# Linux/Mac:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Timeout on Termux"

**Solution:**
```bash
# Increase timeout in server.js
# Change: timeout: 30000
# To: timeout: 60000

# Or use faster model:
MODEL=gemma-7b-it npm start
```

### Issue: "Network error on mobile"

**Solution:**
- ✅ Check internet connection
- ✅ Use mobile hotspot if needed
- ✅ Reduce payload size
- ✅ Use faster Groq model

---

## 📚 Resources

- **Groq Docs**: [docs.groq.com](https://docs.groq.com)
- **Claude App**: PlayStore (free)
- **Railway Docs**: [railway.app/docs](https://railway.app/docs)
- **Node.js Docs**: [nodejs.org](https://nodejs.org)
- **Express Docs**: [expressjs.com](https://expressjs.com)

---

## 🤝 Contributing

Want to improve this project?

1. Fork the repo ✅
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes ✅
4. Push: `git push origin feature/your-feature`
5. Create PR 📤

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details!

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file.

---

## 🎉 You're Ready!

You now have everything to:
- ✅ Build AI agents locally
- ✅ Deploy to production (free!)
- ✅ Code on phone with Termux
- ✅ Use Claude for guidance
- ✅ Scale with Groq

**Start building! 🚀💚**

---

**Questions?** Check the [README.md](./README.md) or create an issue!

**Made with 💚 for mobile developers everywhere**