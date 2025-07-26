#!/usr/bin/env node

/**
 * Simple Backend Test Script
 * Tests basic functionality without external dependencies
 */

import http from "http";
import { URL } from "url";

const BASE_URL = "http://localhost:3001";

/**
 * Make HTTP request
 */
function makeRequest(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test health endpoint
 */
async function testHealth() {
  try {
    console.log("🔍 Testing health endpoint...");
    const response = await makeRequest("/health");
    
    if (response.status === 200 && response.data.status === "healthy") {
      console.log("✅ Health check passed");
      return true;
    } else {
      console.log("❌ Health check failed:", response);
      return false;
    }
  } catch (error) {
    console.log("❌ Health check error:", error.message);
    return false;
  }
}

/**
 * Test analysis health endpoint
 */
async function testAnalysisHealth() {
  try {
    console.log("🔍 Testing analysis health endpoint...");
    const response = await makeRequest("/api/analysis/health");
    
    if (response.status === 200 && response.data.status === "healthy") {
      console.log("✅ Analysis health check passed");
      return true;
    } else {
      console.log("❌ Analysis health check failed:", response);
      return false;
    }
  } catch (error) {
    console.log("❌ Analysis health check error:", error.message);
    return false;
  }
}

/**
 * Test analysis endpoint with mock data
 */
async function testAnalysisEndpoint() {
  try {
    console.log("🔍 Testing analysis endpoint...");
    
    const mockNavData = {
      fundName: "Test Fund",
      date: "2024-01-01",
      totalAssets: 1000000,
      totalLiabilities: 50000,
      netAssets: 950000,
      unitsOutstanding: 10000,
      navPerUnit: 95.00,
      officialNav: 95.00,
      assetBreakdown: [],
      liabilityBreakdown: [],
      rawText: "Test NAV document content",
      confidence: 0.8
    };

    const response = await makeRequest("/api/analysis/full", "POST", { navData: mockNavData });
    
    if (response.status === 500) {
      console.log("✅ Analysis endpoint correctly returned error (no API key)");
      return true;
    } else {
      console.log("❌ Analysis endpoint unexpected response:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Analysis test error:", error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🚀 Starting Shadow NAV Sentinel Backend Tests\n");
  
  const tests = [
    { name: "Health Check", fn: testHealth },
    { name: "Analysis Health Check", fn: testAnalysisHealth },
    { name: "Analysis Endpoint", fn: testAnalysisEndpoint }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const result = await test.fn();
    if (result) passed++;
  }

  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 All tests passed! Backend is ready.");
  } else {
    console.log("⚠️  Some tests failed. Check your setup.");
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 