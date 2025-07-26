/**
 * Main App Component
 * Shadow NAV Sentinel - NAV document analysis and anomaly detection
 */

import React, { useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import FileUpload from "./components/FileUpload";
import NAVAnalysis from "./components/NAVAnalysis";
import { NAVData, FullAnalysisResponse, AnalysisStatus } from "./types";

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [navData, setNavData] = useState<NAVData | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (data: NAVData) => {
    setNavData(data);
    setStatus("processing");
    setError(null);

    try {
      // Simulate API call for full analysis
      const response = await fetch("/api/analysis/full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ navData: data }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
      setStatus("completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStatus("error");
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setStatus("error");
  };

  const resetAnalysis = () => {
    setStatus("idle");
    setNavData(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Shadow NAV Sentinel
                </h1>
                <p className="text-sm text-gray-600">
                  NAV Document Analysis & Anomaly Detection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {status === "completed" && (
                <button
                  onClick={resetAnalysis}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  New Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {status === "idle" && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Analyze NAV Documents
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a NAV PDF document to automatically extract data, reconstruct calculations, 
              and detect potential anomalies or discrepancies.
            </p>
          </div>
        )}

        {/* File Upload */}
        {status === "idle" && (
          <FileUpload
            onFileUpload={handleFileUpload}
            onError={handleError}
            isLoading={false}
          />
        )}

        {/* Processing State */}
        {status === "processing" && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analyzing NAV Document
            </h3>
            <p className="text-gray-600">
              Extracting data, reconstructing calculations, and detecting anomalies...
            </p>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertTriangle className="h-12 w-12 text-danger-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={resetAnalysis}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {status === "completed" && navData && analysis && (
          <NAVAnalysis
            navData={navData}
            analysis={analysis}
            isLoading={false}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>
              Shadow NAV Sentinel - Financial Transparency & Anomaly Detection
            </p>
            <p className="mt-1">
              Powered by Google Gemini AI • Built for investors and regulators
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App; 