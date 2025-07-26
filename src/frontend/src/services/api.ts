/**
 * API Service for Shadow NAV Sentinel
 * Handles all communication with the backend
 */

import axios, { AxiosResponse } from "axios";
import { 
  UploadResponse, 
  FullAnalysisResponse, 
  NAVData, 
  APIError 
} from "../types";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);
    const apiError: APIError = {
      error: error.response?.data?.error || "Network Error",
      message: error.response?.data?.message || error.message,
      timestamp: error.response?.data?.timestamp,
    };
    return Promise.reject(apiError);
  }
);

/**
 * Upload NAV PDF document
 * @param file - PDF file to upload
 * @returns Promise<UploadResponse>
 */
export const uploadNAVDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("navDocument", file);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Perform full NAV analysis
 * @param navData - NAV data to analyze
 * @returns Promise<FullAnalysisResponse>
 */
export const performFullAnalysis = async (navData: NAVData): Promise<FullAnalysisResponse> => {
  const response = await api.post<FullAnalysisResponse>("/analysis/full", {
    navData,
  });

  return response.data;
};

/**
 * Reconstruct NAV calculation
 * @param navData - NAV data to reconstruct
 * @returns Promise<FullAnalysisResponse>
 */
export const reconstructNAV = async (navData: NAVData): Promise<FullAnalysisResponse> => {
  const response = await api.post<FullAnalysisResponse>("/analysis/reconstruct", {
    navData,
  });

  return response.data;
};

/**
 * Compare official vs reconstructed NAV
 * @param officialData - Official NAV data
 * @param reconstructedData - Reconstructed NAV data
 * @returns Promise<FullAnalysisResponse>
 */
export const compareNAV = async (
  officialData: NAVData, 
  reconstructedData: any
): Promise<FullAnalysisResponse> => {
  const response = await api.post<FullAnalysisResponse>("/analysis/compare", {
    officialData,
    reconstructedData,
  });

  return response.data;
};

/**
 * Generate NAV explanation
 * @param navData - NAV data to explain
 * @returns Promise<FullAnalysisResponse>
 */
export const explainNAV = async (navData: NAVData): Promise<FullAnalysisResponse> => {
  const response = await api.post<FullAnalysisResponse>("/analysis/explain", {
    navData,
  });

  return response.data;
};

/**
 * Check backend health
 * @returns Promise<{ status: string; service: string; timestamp: string }>
 */
export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

/**
 * Check analysis service health
 * @returns Promise<{ status: string; service: string; timestamp: string }>
 */
export const checkAnalysisHealth = async () => {
  const response = await api.get("/analysis/health");
  return response.data;
};

export default api; 