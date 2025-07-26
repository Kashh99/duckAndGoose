# Environment Setup Guide

## Step 1: Create .env File

Create a `.env` file in the root directory of the project with the following content:

```env
# Shadow NAV Sentinel Environment Configuration

# Backend Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Google Gemini AI Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Database Configuration (for future enhancements)
# Uncomment and configure when adding database support
# DATABASE_URL=postgresql://username:password@localhost:5432/nav_sentinel

# Redis Configuration (for caching)
# Uncomment and configure when adding Redis support
# REDIS_URL=redis://localhost:6379

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Replace `your_actual_gemini_api_key_here` in your `.env` file

## Step 3: Database Setup (Optional)

For future database integration, you can set up:

### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# On Windows: Download from https://www.postgresql.org/download/windows/
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql postgresql-contrib

# Create database
createdb nav_sentinel

# Update .env with your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/nav_sentinel
```

### SQLite (Simple Alternative)
```bash
# SQLite is included with Node.js
# No additional setup required
DATABASE_URL=sqlite:./data/nav_sentinel.db
```

## Step 4: Redis Setup (Optional)

For caching and session management:

```bash
# Install Redis
# On Windows: Use WSL or Docker
# On macOS: brew install redis
# On Ubuntu: sudo apt-get install redis-server

# Start Redis
redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

## Step 5: Verify Configuration

Run the test script to verify your setup:

```bash
cd src/tests
node test-backend.js
```

## Environment Variables Explained

### Required Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI analysis)

### Backend Configuration
- `PORT`: Backend server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `LOG_LEVEL`: Logging verbosity (debug/info/warn/error)
- `LOG_FILE_PATH`: Directory for log files

### Security Configuration
- `CORS_ORIGIN`: Allowed frontend origin
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (100)

### Frontend Configuration
- `REACT_APP_API_URL`: Backend API URL for frontend

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Ensure your `.env` file is in the root directory
   - Check that the API key is correctly copied
   - Verify the API key is active in Google AI Studio

2. **"Port already in use"**
   - Change the PORT in `.env` to another value (e.g., 3002)
   - Kill the process using the current port

3. **"CORS errors"**
   - Ensure CORS_ORIGIN matches your frontend URL
   - Check that both frontend and backend are running

4. **"Database connection failed"**
   - Verify database is running
   - Check connection string format
   - Ensure database exists

### Testing Your Setup

```bash
# Test backend health
curl http://localhost:3001/health

# Test analysis service
curl http://localhost:3001/api/analysis/health

# Test with sample data
node src/tests/test-backend.js
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Use environment-specific configurations for production
- Consider using a secrets management service for production deployments 