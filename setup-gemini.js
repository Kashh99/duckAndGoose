#!/usr/bin/env node

/**
 * Gemini API Key Setup Script
 * Helps users configure their Gemini API key for the Shadow NAV Sentinel
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔑 Gemini API Key Setup for Shadow NAV Sentinel\n");

console.log("To enable AI-powered NAV analysis, you need a Gemini API key.");
console.log("1. Visit: https://makersuite.google.com/app/apikey");
console.log("2. Sign in with your Google account");
console.log("3. Create a new API key");
console.log("4. Copy the key and paste it below\n");

// Check if .env exists
const envPath = path.join(__dirname, ".env");
let envContent = "";

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
  console.log("📝 Found existing .env file");
} else {
  console.log("📝 Creating new .env file...");
  envContent = `# Shadow NAV Sentinel Environment Configuration

# Backend Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Google Gemini AI Configuration
GEMINI_API_KEY=AIzaSyD-9tS6dF_8H7YipRpkYlka_v-NQeqY9ik

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
}

// Ask for API key
const apiKey = await askQuestion("Enter your Gemini API key (or press Enter to skip): ");

if (apiKey && apiKey.trim()) {
  // Update the API key in the .env content
  const updatedContent = envContent.replace(
    /GEMINI_API_KEY=.*/,
    `GEMINI_API_KEY=${apiKey.trim()}`
  );
  
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log("✅ Gemini API key configured successfully!");
    console.log("🚀 Restart your backend server to enable AI features.");
  } catch (error) {
    console.error("❌ Error saving API key:", error.message);
  }
} else {
  console.log("⚠️  No API key provided. AI features will be disabled.");
  console.log("   You can manually edit the .env file later to add your key.");
}

console.log("\n📋 Next steps:");
console.log("1. Restart your backend server: cd src/backend && npm run dev");
console.log("2. Test the AI features by uploading a PDF");
console.log("3. Check the logs to see if Gemini AI is working");

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
} 