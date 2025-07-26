/**
 * NAV Analysis Component
 * Displays NAV analysis results, comparison, and anomaly detection
 */

import React from "react";
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { NAVData, FullAnalysisResponse } from "../types";

interface NAVAnalysisProps {
  navData: NAVData;
  analysis: FullAnalysisResponse | null;
  isLoading?: boolean;
}

const NAVAnalysis: React.FC<NAVAnalysisProps> = ({ 
  navData, 
  analysis, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { summary, analysis: analysisData } = analysis;
  const { reconstruction, comparison, explanation } = analysisData;

  const navDifference = summary.officialNav - summary.reconstructedNav;
  const navPercentage = (Math.abs(navDifference) / summary.officialNav) * 100;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-danger-600 bg-danger-50 border-danger-200";
      case "high":
        return "text-danger-600 bg-danger-50 border-danger-200";
      case "medium":
        return "text-warning-600 bg-warning-50 border-warning-200";
      case "low":
        return "text-success-600 bg-success-50 border-success-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "medium":
        return <Info className="h-5 w-5" />;
      case "low":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Summary Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            NAV Analysis Results
          </h2>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getSeverityColor(summary.severity)}`}>
            <div className="flex items-center space-x-1">
              {getSeverityIcon(summary.severity)}
              <span className="capitalize">{summary.severity} Risk</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${summary.officialNav.toFixed(4)}
            </div>
            <div className="text-sm text-gray-600">Official NAV</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${summary.reconstructedNav.toFixed(4)}
            </div>
            <div className="text-sm text-gray-600">Reconstructed NAV</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center space-x-1 ${
              navDifference > 0 ? "text-danger-600" : "text-success-600"
            }`}>
              {navDifference > 0 ? (
                <TrendingDown className="h-6 w-6" />
              ) : (
                <TrendingUp className="h-6 w-6" />
              )}
              <span>${Math.abs(navDifference).toFixed(4)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Difference ({navPercentage.toFixed(4)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NAV Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">NAV Comparison</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Official NAV:</span>
              <span className="text-sm font-mono text-gray-900">
                ${summary.officialNav.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Reconstructed NAV:</span>
              <span className="text-sm font-mono text-gray-900">
                ${summary.reconstructedNav.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Confidence:</span>
              <span className="text-sm font-mono text-gray-900">
                {reconstruction.confidence}%
              </span>
            </div>
          </div>

          {reconstruction.calculationSteps.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Calculation Steps:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {reconstruction.calculationSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary-600 font-mono text-xs mt-1">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h3 className="text-lg font-semibold text-gray-900">Anomaly Detection</h3>
          </div>

          <div className="space-y-4">
            <div className={`p-3 rounded border ${getSeverityColor(comparison.severity)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getSeverityIcon(comparison.severity)}
                <span className="font-medium capitalize">{comparison.severity} Severity</span>
              </div>
              <p className="text-sm">{comparison.explanation}</p>
            </div>

            {comparison.anomalies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Anomalies:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {comparison.anomalies.map((anomaly, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-warning-600 font-mono text-xs mt-1">•</span>
                      <span>{anomaly}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {comparison.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {comparison.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-600 font-mono text-xs mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NAV Explanation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">NAV Explanation</h3>
        </div>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-wrap">{explanation.explanation}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => window.print()}
        >
          Export Report
        </button>
        {summary.requiresInvestigation && (
          <button className="px-6 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors">
            Flag for Investigation
          </button>
        )}
      </div>
    </div>
  );
};

export default NAVAnalysis; 