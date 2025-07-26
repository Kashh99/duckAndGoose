/**
 * Analysis Routes
 * Handles NAV reconstruction, comparison, and explanation requests
 */

import express from "express";
import { logger } from "../utils/logger.js";
import { 
  analyzeNAV, 
  reconstructNAV, 
  compareNAV, 
  explainNAV 
} from "../services/geminiService.js";

const router = express.Router();

/**
 * POST /api/analysis/reconstruct
 * Reconstruct NAV calculation using Gemini AI
 */
router.post("/reconstruct", async (req, res) => {
  try {
    const { navData } = req.body;

    if (!navData) {
      return res.status(400).json({
        error: "Missing NAV data",
        message: "navData is required in request body"
      });
    }

    logger.info("NAV reconstruction requested", {
      fundName: navData.fundName,
      date: navData.date
    });

    // Reconstruct NAV using Gemini AI
    const reconstruction = await reconstructNAV(navData);

    const response = {
      success: true,
      reconstruction,
      originalData: navData,
      timestamp: new Date().toISOString()
    };

    logger.info("NAV reconstruction completed", {
      fundName: navData.fundName,
      confidence: reconstruction.confidence
    });

    res.status(200).json(response);

  } catch (error) {
    logger.error("NAV reconstruction failed:", error);
    
    res.status(500).json({
      error: "NAV reconstruction failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/analysis/compare
 * Compare official vs reconstructed NAV and flag anomalies
 */
router.post("/compare", async (req, res) => {
  try {
    const { officialData, reconstructedData } = req.body;

    if (!officialData || !reconstructedData) {
      return res.status(400).json({
        error: "Missing data",
        message: "Both officialData and reconstructedData are required"
      });
    }

    logger.info("NAV comparison requested", {
      fundName: officialData.fundName,
      officialNav: officialData.officialNav,
      reconstructedNav: reconstructedData.reconstructedNav
    });

    // Compare NAVs using Gemini AI
    const comparison = await compareNAV(officialData, reconstructedData);

    const response = {
      success: true,
      comparison,
      officialData,
      reconstructedData,
      timestamp: new Date().toISOString()
    };

    logger.info("NAV comparison completed", {
      fundName: officialData.fundName,
      severity: comparison.severity,
      requiresInvestigation: comparison.requiresInvestigation
    });

    res.status(200).json(response);

  } catch (error) {
    logger.error("NAV comparison failed:", error);
    
    res.status(500).json({
      error: "NAV comparison failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/analysis/explain
 * Generate explanation of NAV structure and components
 */
router.post("/explain", async (req, res) => {
  try {
    const { navData } = req.body;

    if (!navData) {
      return res.status(400).json({
        error: "Missing NAV data",
        message: "navData is required in request body"
      });
    }

    logger.info("NAV explanation requested", {
      fundName: navData.fundName,
      date: navData.date
    });

    // Generate explanation using Gemini AI
    const explanation = await explainNAV(navData);

    const response = {
      success: true,
      explanation,
      navData,
      timestamp: new Date().toISOString()
    };

    logger.info("NAV explanation completed", {
      fundName: navData.fundName
    });

    res.status(200).json(response);

  } catch (error) {
    logger.error("NAV explanation failed:", error);
    
    res.status(500).json({
      error: "NAV explanation failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/analysis/full
 * Perform complete NAV analysis (reconstruct, compare, explain)
 */
router.post("/full", async (req, res) => {
  try {
    const { navData } = req.body;

    if (!navData) {
      return res.status(400).json({
        error: "Missing NAV data",
        message: "navData is required in request body"
      });
    }

    logger.info("Full NAV analysis requested", {
      fundName: navData.fundName,
      date: navData.date
    });

    // Perform all analysis steps
    const [reconstruction, explanation] = await Promise.all([
      reconstructNAV(navData),
      explainNAV(navData)
    ]);

    // Compare official vs reconstructed
    const comparison = await compareNAV(navData, reconstruction);

    const response = {
      success: true,
      analysis: {
        reconstruction,
        comparison,
        explanation
      },
      originalData: navData,
      summary: {
        fundName: navData.fundName,
        date: navData.date,
        officialNav: navData.officialNav,
        reconstructedNav: reconstruction.reconstructedNav,
        confidence: reconstruction.confidence,
        severity: comparison.severity,
        requiresInvestigation: comparison.requiresInvestigation
      },
      timestamp: new Date().toISOString()
    };

    logger.info("Full NAV analysis completed", {
      fundName: navData.fundName,
      confidence: reconstruction.confidence,
      severity: comparison.severity
    });

    res.status(200).json(response);

  } catch (error) {
    logger.error("Full NAV analysis failed:", error);
    
    res.status(500).json({
      error: "Full NAV analysis failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/analysis/health
 * Check analysis service health
 */
router.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "healthy",
      service: "NAV Analysis",
      timestamp: new Date().toISOString(),
      features: [
        "NAV Reconstruction",
        "Anomaly Detection",
        "Comparison Analysis",
        "Explanation Generation"
      ]
    });
  } catch (error) {
    logger.error("Health check failed:", error);
    
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 