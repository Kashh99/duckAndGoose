/**
 * PDF Parsing Service
 * Extracts NAV data from PDF documents (Mock implementation for testing)
 */

import fs from "fs";
import { logger } from "../utils/logger.js";

/**
 * NAV Data Structure
 * @typedef {Object} NAVData
 * @property {string} fundName - Name of the fund
 * @property {string} date - NAV calculation date
 * @property {number} totalAssets - Total assets value
 * @property {number} totalLiabilities - Total liabilities value
 * @property {number} netAssets - Net assets (assets - liabilities)
 * @property {number} unitsOutstanding - Number of units outstanding
 * @property {number} navPerUnit - NAV per unit
 * @property {number} officialNav - Official NAV as stated in document
 * @property {Array<Object>} assetBreakdown - Detailed asset breakdown
 * @property {Array<Object>} liabilityBreakdown - Detailed liability breakdown
 */

/**
 * Parse PDF and extract NAV data
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<NAVData>} Extracted NAV data
 */
export const parsePDF = async (filePath) => {
  try {
    logger.info(`Starting PDF parsing for: ${filePath}`);
    
    const navData = {
      fundName: "",
      date: "",
      totalAssets: 0,
      totalLiabilities: 0,
      netAssets: 0,
      unitsOutstanding: 0,
      navPerUnit: 0,
      officialNav: 0,
      assetBreakdown: [],
      liabilityBreakdown: [],
      rawText: "",
      confidence: 0
    };

    // Mock PDF parsing for testing - in production, use a proper PDF library
    const mockText = `
    FUND NAME: Test Investment Fund
    DATE: 2024-01-15
    TOTAL ASSETS: $1,250,000.00
    TOTAL LIABILITIES: $50,000.00
    NET ASSETS: $1,200,000.00
    UNITS OUTSTANDING: 10,000
    NAV PER UNIT: $120.00
    OFFICIAL NAV: $120.00
    
    ASSET BREAKDOWN:
    - Cash and Equivalents: $200,000.00
    - Fixed Income Securities: $500,000.00
    - Equity Securities: $550,000.00
    
    LIABILITY BREAKDOWN:
    - Management Fees: $30,000.00
    - Administrative Expenses: $20,000.00
    `;
    
    navData.rawText = mockText;

    // Use regex patterns to extract key NAV information
    const extractedData = extractNAVData(mockText);
    
    // Merge extracted data with default structure
    Object.assign(navData, extractedData);

    logger.info("PDF parsing completed successfully", {
      fundName: navData.fundName,
      date: navData.date,
      totalAssets: navData.totalAssets,
      officialNav: navData.officialNav
    });

    return navData;

  } catch (error) {
    logger.error("PDF parsing failed:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Extract NAV data using regex patterns
 * @param {string} text - Raw text from PDF
 * @returns {Object} Extracted NAV data
 */
const extractNAVData = (text) => {
  const data = {};

  // Extract fund name (look for common patterns)
  const fundNamePatterns = [
    /fund\s+name[:\s]+([^\n\r]+)/i,
    /([A-Z][A-Z\s&]+fund)/i,
    /([A-Z][A-Z\s&]+trust)/i
  ];

  for (const pattern of fundNamePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.fundName = match[1].trim();
      break;
    }
  }

  // Extract date
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/,
    /(\w+\s+\d{1,2},?\s+\d{4})/
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.date = match[1];
      break;
    }
  }

  // Extract monetary values
  const currencyPattern = /[\$£€]?[\s]*([\d,]+\.?\d*)/g;
  const numbers = [];
  let match;

  while ((match = currencyPattern.exec(text)) !== null) {
    const value = parseFloat(match[1].replace(/,/g, ""));
    if (!isNaN(value) && value > 0) {
      numbers.push(value);
    }
  }

  // Sort numbers to identify key values
  numbers.sort((a, b) => b - a);

  if (numbers.length >= 4) {
    // Assume largest numbers are total assets, liabilities, etc.
    data.totalAssets = numbers[0];
    data.totalLiabilities = numbers[1] || 0;
    data.netAssets = data.totalAssets - data.totalLiabilities;
    data.unitsOutstanding = numbers[2] || 1;
    data.navPerUnit = data.netAssets / data.unitsOutstanding;
    data.officialNav = numbers[3] || data.navPerUnit;
  }

  // Extract asset and liability breakdown
  data.assetBreakdown = extractBreakdown(text, "asset");
  data.liabilityBreakdown = extractBreakdown(text, "liability");

  return data;
};

/**
 * Extract detailed breakdown of assets or liabilities
 * @param {string} text - Raw text from PDF
 * @param {string} type - "asset" or "liability"
 * @returns {Array<Object>} Breakdown items
 */
const extractBreakdown = (text, type) => {
  const breakdown = [];
  const lines = text.split("\n");
  
  let inSection = false;
  const sectionKeywords = type === "asset" 
    ? ["assets", "investments", "holdings"]
    : ["liabilities", "expenses", "fees"];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if we're entering the section
    if (sectionKeywords.some(keyword => lowerLine.includes(keyword))) {
      inSection = true;
      continue;
    }

    if (inSection) {
      // Look for lines with descriptions and amounts
      const amountMatch = line.match(/[\$£€]?[\s]*([\d,]+\.?\d*)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
        const description = line.replace(/[\$£€]?[\s]*[\d,]+\.?\d*/, "").trim();
        
        if (description && !isNaN(amount)) {
          breakdown.push({
            description: description,
            amount: amount
          });
        }
      }

      // Exit section if we hit a total or summary
      if (lowerLine.includes("total") || lowerLine.includes("summary")) {
        break;
      }
    }
  }

  return breakdown;
};

/**
 * Validate extracted NAV data
 * @param {NAVData} navData - Extracted NAV data
 * @returns {Object} Validation result
 */
export const validateNAVData = (navData) => {
  const errors = [];
  const warnings = [];

  // Check for required fields
  if (!navData.fundName) {
    errors.push("Fund name not found");
  }

  if (!navData.date) {
    errors.push("Date not found");
  }

  if (navData.totalAssets <= 0) {
    errors.push("Total assets must be greater than 0");
  }

  if (navData.unitsOutstanding <= 0) {
    errors.push("Units outstanding must be greater than 0");
  }

  // Check for mathematical consistency
  const calculatedNav = navData.netAssets / navData.unitsOutstanding;
  const navDifference = Math.abs(calculatedNav - navData.officialNav);
  const navPercentage = (navDifference / navData.officialNav) * 100;

  if (navPercentage > 0.01) { // 0.01% tolerance
    warnings.push(`NAV calculation discrepancy: ${navPercentage.toFixed(4)}%`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}; 