/**
 * Upload Routes
 * Handles PDF upload, storage, and initial parsing
 */

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";
import { parsePDF, validateNAVData } from "../services/pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../data/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `nav-${uniqueId}${extension}`);
  }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * POST /api/upload
 * Upload and parse NAV PDF document
 */
router.post("/", upload.single("navDocument"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please upload a PDF file"
      });
    }

    logger.info("File upload received", {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size
    });

    // Parse the uploaded PDF
    const navData = await parsePDF(req.file.path);
    
    // Validate the extracted data
    const validation = validateNAVData(navData);

    // Create response object
    const response = {
      success: true,
      documentId: path.parse(req.file.filename).name,
      filename: req.file.originalname,
      filePath: req.file.path,
      navData: {
        ...navData,
        confidence: validation.confidence
      },
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      },
      timestamp: new Date().toISOString()
    };

    logger.info("PDF upload and parsing completed", {
      documentId: response.documentId,
      fundName: navData.fundName,
      confidence: validation.confidence
    });

    res.status(200).json(response);

  } catch (error) {
    logger.error("Upload processing failed:", error);
    
    res.status(500).json({
      error: "Upload processing failed",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/upload/status/:documentId
 * Get processing status of uploaded document
 */
router.get("/status/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // For now, return a simple status
    // In a real implementation, this would check a database or cache
    res.status(200).json({
      documentId,
      status: "completed",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error("Status check failed:", error);
    
    res.status(500).json({
      error: "Status check failed",
      message: error.message
    });
  }
});

/**
 * DELETE /api/upload/:documentId
 * Remove uploaded document and associated data
 */
router.delete("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // In a real implementation, this would remove files and database records
    logger.info("Document deletion requested", { documentId });
    
    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      documentId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error("Document deletion failed:", error);
    
    res.status(500).json({
      error: "Document deletion failed",
      message: error.message
    });
  }
});

export default router; 