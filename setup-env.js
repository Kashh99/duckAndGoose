#!/usr/bin/env node

/**
 * Environment Setup Script for Shadow NAV Sentinel
 * Helps configure the .env file with necessary settings
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");

console.log("🔧 Shadow NAV Sentinel Environment Setup\n");

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log("⚠️  .env file already exists!");
  const answer = await askQuestion("Do you want to overwrite it? (y/N): ");
  if (answer.toLowerCase() !== "y") {
    console.log("Setup cancelled.");
    process.exit(0);
  }
}

console.log("📝 Creating .env file...\n");

// Get user input
const geminiKey = await askQuestion("Enter your Gemini API key (or press Enter to skip): ");
const port = await askQuestion("Backend port (default: 3001): ") || "3001";
const logLevel = await askQuestion("Log level (default: info): ") || "info";

// Create .env content
const envContent = `# Shadow NAV Sentinel Environment Configuration

# Backend Configuration
PORT=${port}
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:${port}/api

# Google Gemini AI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=${geminiKey || "your_gemini_api_key_here"}

# Database Configuration (for future enhancements)
# Uncomment and configure when adding database support
# DATABASE_URL=postgresql://username:password@localhost:5432/nav_sentinel

# Redis Configuration (for caching)
# Uncomment and configure when adding Redis support
# REDIS_URL=redis://localhost:6379

# Logging Configuration
LOG_LEVEL=${logLevel}
LOG_FILE_PATH=./logs

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

// Write .env file
try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  
  if (!geminiKey) {
    console.log("\n⚠️  IMPORTANT: You need to add your Gemini API key to the .env file");
    console.log("   Get your API key from: https://makersuite.google.com/app/apikey");
    console.log("   Then edit the .env file and replace 'your_gemini_api_key_here' with your actual key");
  }
  
  console.log("\n🚀 Next steps:");
  console.log("1. Install dependencies: npm install (in both backend and frontend directories)");
  console.log("2. Start the backend: cd src/backend && npm run dev");
  console.log("3. Start the frontend: cd src/frontend && npm start");
  console.log("4. Test the setup: node src/tests/test-backend.js");
  
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
  process.exit(1);
}

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
} 