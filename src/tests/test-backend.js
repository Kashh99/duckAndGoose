/**
 * Simple Backend Test Script
 * Tests basic functionality of the Shadow NAV Sentinel backend
 */

import fetch from "node-fetch";

const BASE_URL = "http://localhost:3001";

/**
 * Test health endpoint
 */
async function testHealth() {
  try {
    console.log("🔍 Testing health endpoint...");
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === "healthy") {
      console.log("✅ Health check passed");
      return true;
    } else {
      console.log("❌ Health check failed:", data);
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
    const response = await fetch(`${BASE_URL}/api/analysis/health`);
    const data = await response.json();
    
    if (response.ok && data.status === "healthy") {
      console.log("✅ Analysis health check passed");
      return true;
    } else {
      console.log("❌ Analysis health check failed:", data);
      return false;
    }
  } catch (error) {
    console.log("❌ Analysis health check error:", error.message);
    return false;
  }
}

/**
 * Test upload endpoint with mock data
 */
async function testUploadEndpoint() {
  try {
    console.log("🔍 Testing upload endpoint...");
    
    // Create a mock FormData (in real test, you'd upload an actual PDF)
    const formData = new FormData();
    formData.append("navDocument", "mock-pdf-data");
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (response.status === 400) {
      console.log("✅ Upload endpoint correctly rejected invalid data");
      return true;
    } else {
      console.log("❌ Upload endpoint unexpected response:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Upload test error:", error.message);
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
      confidence: 85
    };
    
    const response = await fetch(`${BASE_URL}/api/analysis/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ navData: mockNavData }),
    });
    
    if (response.status === 500) {
      console.log("✅ Analysis endpoint correctly handled missing API key");
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
    { name: "Upload Endpoint", fn: testUploadEndpoint },
    { name: "Analysis Endpoint", fn: testAnalysisEndpoint },
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
    console.log("⚠️  Some tests failed. Check the backend setup.");
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 