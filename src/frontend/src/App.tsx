/**
 * Main App Component
 * Shadow NAV Sentinel - NAV document analysis and anomaly detection
 * Professional, clean, and user-friendly interface
 */

import React, { useState, useCallback } from "react";
import { Shield, AlertTriangle, BarChart3, FileText, Settings } from "lucide-react";
import { FileUpload, NAVAnalysis, Button } from "./components";
import { NAVData, FullAnalysisResponse, AnalysisStatus } from "./types";

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [navData, setNavData] = useState<NAVData | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (data: NAVData) => {
    setNavData(data);
    setStatus("processing");
    setError(null);

    try {
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
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setStatus("error");
  }, []);

  const resetAnalysis = useCallback(() => {
    setStatus("idle");
    setNavData(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
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
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetAnalysis}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </div>
    </header>
  );

  const renderWelcomeSection = () => (
    <div className="text-center mb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full">
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze NAV Documents
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Upload a NAV PDF document to automatically extract data, reconstruct calculations, 
          and detect potential anomalies or discrepancies with AI-powered analysis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-3">
              <FileText className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Upload PDF</h3>
            <p className="text-sm text-gray-600">Drag & drop your NAV document</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
            <p className="text-sm text-gray-600">Extract & reconstruct data</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Detect Issues</h3>
            <p className="text-sm text-gray-600">Identify anomalies & risks</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Analyzing NAV Document
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Our AI is extracting data, reconstructing calculations, and detecting potential anomalies. 
          This may take a few moments...
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <span>Extracting document data</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <span>Reconstructing NAV calculations</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            <span>Detecting anomalies</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="flex items-center justify-center w-16 h-16 bg-danger-100 rounded-full mx-auto mb-6">
        <AlertTriangle className="h-8 w-8 text-danger-600" />
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        Analysis Failed
      </h3>
      
      <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={resetAnalysis}
        >
          <FileText className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          onClick={resetAnalysis}
        >
          Upload New Document
        </Button>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="mt-20 pt-8 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">
              Shadow NAV Sentinel
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">
            Financial Transparency & Anomaly Detection
          </p>
          
          <p className="text-sm text-gray-500">
            Powered by Google Gemini AI • Built for investors and regulators
          </p>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {renderHeader()}
      
      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        {status === "idle" && renderWelcomeSection()}
        
        {status === "idle" && (
          <FileUpload
            onFileUpload={handleFileUpload}
            onError={handleError}
            isLoading={false}
          />
        )}
        
        {status === "processing" && renderProcessingState()}
        
        {status === "error" && renderErrorState()}
        
        {status === "completed" && navData && analysis && (
          <NAVAnalysis
            navData={navData}
            analysis={analysis}
            isLoading={false}
          />
        )}
      </main>
      
      {renderFooter()}
    </div>
  );
};

export default App; 