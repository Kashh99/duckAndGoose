/**
 * TypeScript type definitions for Shadow NAV Sentinel
 */

export interface NAVData {
  fundName: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  unitsOutstanding: number;
  navPerUnit: number;
  officialNav: number;
  assetBreakdown: BreakdownItem[];
  liabilityBreakdown: BreakdownItem[];
  rawText: string;
  confidence: number;
}

export interface BreakdownItem {
  description: string;
  amount: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: number;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  filename: string;
  filePath: string;
  navData: NAVData;
  validation: ValidationResult;
  timestamp: string;
}

export interface ReconstructionResult {
  reconstructedNav: number;
  calculationSteps: string[];
  confidence: number;
  notes: string;
  potentialIssues: string[];
  timestamp: string;
  model: string;
}

export interface ComparisonResult {
  anomalies: string[];
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
  recommendations: string[];
  requiresInvestigation: boolean;
  timestamp: string;
  model: string;
}

export interface ExplanationResult {
  explanation: string;
  timestamp: string;
  model: string;
}

export interface AnalysisResult {
  reconstruction: ReconstructionResult;
  comparison: ComparisonResult;
  explanation: ExplanationResult;
}

export interface FullAnalysisResponse {
  success: boolean;
  analysis: AnalysisResult;
  originalData: NAVData;
  summary: {
    fundName: string;
    date: string;
    officialNav: number;
    reconstructedNav: number;
    confidence: number;
    severity: string;
    requiresInvestigation: boolean;
  };
  timestamp: string;
}

export interface APIError {
  error: string;
  message: string;
  timestamp?: string;
}

export type AnalysisStatus = "idle" | "uploading" | "processing" | "completed" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  navData: NAVData | null;
  analysis: FullAnalysisResponse | null;
  error: string | null;
} 