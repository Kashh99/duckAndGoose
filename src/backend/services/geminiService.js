/**
 * Gemini AI Service
 * Handles all LLM interactions for NAV analysis and anomaly detection
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger, logLLMInteraction } from "../utils/logger.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * System prompt for NAV analysis
 */
const NAV_ANALYST_PROMPT = `You are a forensic financial analyst skilled in reconstructing NAV logic and identifying subtle discrepancies in Net Asset Value calculations.

Your expertise includes:
- Analyzing fund financial statements and NAV reports
- Reconstructing NAV calculations from component data
- Identifying mathematical inconsistencies and anomalies
- Explaining financial discrepancies in clear, professional language
- Understanding various fund structures and fee arrangements

Always:
- Cross-reference extracted numbers with stated totals
- Highlight any discrepancies above 0.01% tolerance
- Provide specific, actionable insights
- Cite exact values from the document
- Maintain professional, objective tone
- Flag potential errors or missing data

Respond in JSON format when requested for structured data.`;

/**
 * Analyze NAV document using Gemini AI
 * @param {Object} navData - Extracted NAV data from PDF
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeNAV = async (navData) => {
  try {
    logger.info("Starting NAV analysis with Gemini AI");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${NAV_ANALYST_PROMPT}

Please analyze the following NAV data extracted from a fund document:

Fund Name: ${navData.fundName}
Date: ${navData.date}
Total Assets: $${navData.totalAssets.toLocaleString()}
Total Liabilities: $${navData.totalLiabilities.toLocaleString()}
Net Assets: $${navData.netAssets.toLocaleString()}
Units Outstanding: ${navData.unitsOutstanding.toLocaleString()}
Calculated NAV per Unit: $${navData.navPerUnit.toFixed(4)}
Official NAV per Unit: $${navData.officialNav.toFixed(4)}

Asset Breakdown:
${navData.assetBreakdown.map(item => `- ${item.description}: $${item.amount.toLocaleString()}`).join("\n")}

Liability Breakdown:
${navData.liabilityBreakdown.map(item => `- ${item.description}: $${item.amount.toLocaleString()}`).join("\n")}

Please provide:
1. A summary of the NAV calculation
2. Any discrepancies found between calculated and official NAV
3. Potential anomalies or concerns
4. Recommendations for further investigation

Respond in a clear, professional manner.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log the interaction for traceability
    logLLMInteraction("nav_analysis", { navData }, { response: text }, "gemini-pro");

    return {
      analysis: text,
      timestamp: new Date().toISOString(),
      model: "gemini-pro"
    };

  } catch (error) {
    logger.error("NAV analysis failed:", error);
    throw new Error(`Gemini AI analysis failed: ${error.message}`);
  }
};

/**
 * Reconstruct NAV calculation using Gemini AI
 * @param {Object} navData - Extracted NAV data
 * @returns {Promise<Object>} Reconstructed NAV calculation
 */
export const reconstructNAV = async (navData) => {
  try {
    logger.info("Starting NAV reconstruction with Gemini AI");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${NAV_ANALYST_PROMPT}

Please reconstruct the NAV calculation from the following data:

Raw Document Text:
${navData.rawText.substring(0, 2000)}...

Extracted Data:
- Total Assets: $${navData.totalAssets.toLocaleString()}
- Total Liabilities: $${navData.totalLiabilities.toLocaleString()}
- Units Outstanding: ${navData.unitsOutstanding.toLocaleString()}

Please provide a JSON response with:
{
  "reconstructedNav": number,
  "calculationSteps": [string],
  "confidence": number (0-100),
  "notes": string,
  "potentialIssues": [string]
}

Focus on mathematical accuracy and identify any missing components.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let parsedResponse;
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = text.match(/```json\s*(\{.*?\})\s*```/s);
      const jsonStr = jsonMatch ? jsonMatch[1] : text;
      parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn("Failed to parse JSON response, using text response");
      parsedResponse = {
        reconstructedNav: navData.navPerUnit,
        calculationSteps: ["Used extracted NAV per unit"],
        confidence: 50,
        notes: text,
        potentialIssues: ["Could not parse structured response"]
      };
    }

    // Log the interaction
    logLLMInteraction("nav_reconstruction", { navData }, { response: parsedResponse }, "gemini-pro");

    return {
      ...parsedResponse,
      timestamp: new Date().toISOString(),
      model: "gemini-pro"
    };

  } catch (error) {
    logger.error("NAV reconstruction failed:", error);
    throw new Error(`NAV reconstruction failed: ${error.message}`);
  }
};

/**
 * Compare official vs reconstructed NAV and flag anomalies
 * @param {Object} officialData - Official NAV data
 * @param {Object} reconstructedData - Reconstructed NAV data
 * @returns {Promise<Object>} Comparison results
 */
export const compareNAV = async (officialData, reconstructedData) => {
  try {
    logger.info("Starting NAV comparison analysis");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${NAV_ANALYST_PROMPT}

Please compare the official NAV calculation with our reconstructed NAV:

OFFICIAL NAV DATA:
- NAV per Unit: $${officialData.officialNav.toFixed(4)}
- Total Assets: $${officialData.totalAssets.toLocaleString()}
- Total Liabilities: $${officialData.totalLiabilities.toLocaleString()}
- Units Outstanding: ${officialData.unitsOutstanding.toLocaleString()}

RECONSTRUCTED NAV DATA:
- NAV per Unit: $${reconstructedData.reconstructedNav.toFixed(4)}
- Confidence: ${reconstructedData.confidence}%

Difference: $${Math.abs(officialData.officialNav - reconstructedData.reconstructedNav).toFixed(4)}
Percentage Difference: ${((Math.abs(officialData.officialNav - reconstructedData.reconstructedNav) / officialData.officialNav) * 100).toFixed(4)}%

Please provide a JSON response with:
{
  "anomalies": [string],
  "severity": "low|medium|high|critical",
  "explanation": string,
  "recommendations": [string],
  "requiresInvestigation": boolean
}

Focus on identifying potential errors, missing data, or suspicious patterns.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let parsedResponse;
    try {
      const jsonMatch = text.match(/```json\s*(\{.*?\})\s*```/s);
      const jsonStr = jsonMatch ? jsonMatch[1] : text;
      parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      logger.warn("Failed to parse comparison JSON response");
      parsedResponse = {
        anomalies: ["Could not parse structured comparison"],
        severity: "medium",
        explanation: text,
        recommendations: ["Manual review required"],
        requiresInvestigation: true
      };
    }

    // Log the interaction
    logLLMInteraction("nav_comparison", 
      { officialData, reconstructedData }, 
      { response: parsedResponse }, 
      "gemini-pro"
    );

    return {
      ...parsedResponse,
      timestamp: new Date().toISOString(),
      model: "gemini-pro"
    };

  } catch (error) {
    logger.error("NAV comparison failed:", error);
    throw new Error(`NAV comparison failed: ${error.message}`);
  }
};

/**
 * Generate explanation of NAV structure and components
 * @param {Object} navData - NAV data to explain
 * @returns {Promise<string>} Natural language explanation
 */
export const explainNAV = async (navData) => {
  try {
    logger.info("Generating NAV explanation");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${NAV_ANALYST_PROMPT}

Please provide a clear, educational explanation of this NAV calculation:

Fund: ${navData.fundName}
Date: ${navData.date}

Key Components:
- Total Assets: $${navData.totalAssets.toLocaleString()}
- Total Liabilities: $${navData.totalLiabilities.toLocaleString()}
- Net Assets: $${navData.netAssets.toLocaleString()}
- Units Outstanding: ${navData.unitsOutstanding.toLocaleString()}
- NAV per Unit: $${navData.navPerUnit.toFixed(4)}

Asset Breakdown:
${navData.assetBreakdown.map(item => `- ${item.description}: $${item.amount.toLocaleString()}`).join("\n")}

Liability Breakdown:
${navData.liabilityBreakdown.map(item => `- ${item.description}: $${item.amount.toLocaleString()}`).join("\n")}

Explain:
1. What NAV represents and why it's important
2. How the calculation works
3. What each component means
4. Any notable aspects of this fund's structure

Write in clear, accessible language suitable for investors and regulators.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log the interaction
    logLLMInteraction("nav_explanation", { navData }, { response: text }, "gemini-pro");

    return {
      explanation: text,
      timestamp: new Date().toISOString(),
      model: "gemini-pro"
    };

  } catch (error) {
    logger.error("NAV explanation failed:", error);
    throw new Error(`NAV explanation failed: ${error.message}`);
  }
}; 