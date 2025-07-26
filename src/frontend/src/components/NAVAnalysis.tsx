/**
 * NAV Analysis Component
 * Professional display of NAV analysis results with comprehensive data visualization
 * Includes comparison, anomaly detection, and detailed explanations
 */

import React, { useMemo } from "react";
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  TrendingDown,
  Download,
  Flag,
  BarChart3,
  Shield,
  Eye
} from "lucide-react";
import { NAVData, FullAnalysisResponse } from "../types";
import { Button } from "./index";

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
  // Move hooks to the top before any early returns
  const getSeverityColor = useMemo(() => {
    if (!analysis) return "text-gray-600 bg-gray-50 border-gray-200";
    
    const colorMap = {
      critical: "text-danger-600 bg-danger-50 border-danger-200",
      high: "text-danger-600 bg-danger-50 border-danger-200",
      medium: "text-warning-600 bg-warning-50 border-warning-200",
      low: "text-success-600 bg-success-50 border-success-200",
    };
    return colorMap[analysis.summary.severity as keyof typeof colorMap] || "text-gray-600 bg-gray-50 border-gray-200";
  }, [analysis]);

  const getSeverityIcon = useMemo(() => {
    if (!analysis) return <Info className="h-5 w-5" />;
    
    const iconMap = {
      critical: <AlertTriangle className="h-5 w-5" />,
      high: <AlertTriangle className="h-5 w-5" />,
      medium: <Info className="h-5 w-5" />,
      low: <CheckCircle className="h-5 w-5" />,
    };
    return iconMap[analysis.summary.severity as keyof typeof iconMap] || <Info className="h-5 w-5" />;
  }, [analysis]);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const getRiskLevel = (percentage: number): { level: string; color: string; description: string } => {
    if (percentage < 0.01) return { level: "Minimal", color: "text-success-600", description: "Very low risk" };
    if (percentage < 0.1) return { level: "Low", color: "text-success-600", description: "Low risk" };
    if (percentage < 1) return { level: "Medium", color: "text-warning-600", description: "Moderate risk" };
    if (percentage < 5) return { level: "High", color: "text-danger-600", description: "High risk" };
    return { level: "Critical", color: "text-danger-600", description: "Critical risk" };
  };

  const riskLevel = getRiskLevel(navPercentage);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Analysis Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              NAV Analysis Results
            </h2>
            <p className="text-gray-600">
              Analysis completed for {summary.fundName} on {summary.date}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getSeverityColor}`}>
            <div className="flex items-center space-x-2">
              {getSeverityIcon}
              <span className="capitalize">{summary.severity} Risk</span>
            </div>
          </div>
        </div>

        {/* NAV Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
              <Calculator className="h-6 w-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(summary.officialNav)}
            </div>
            <div className="text-sm text-gray-600">Official NAV</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(summary.reconstructedNav)}
            </div>
            <div className="text-sm text-gray-600">Reconstructed NAV</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-3">
              {navDifference > 0 ? (
                <TrendingDown className="h-6 w-6 text-warning-600" />
              ) : (
                <TrendingUp className="h-6 w-6 text-success-600" />
              )}
            </div>
            <div className={`text-2xl font-bold mb-1 ${riskLevel.color}`}>
              {formatCurrency(Math.abs(navDifference))}
            </div>
            <div className="text-sm text-gray-600">
              Difference ({navPercentage.toFixed(4)}%)
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {riskLevel.description}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NAV Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
              <Calculator className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">NAV Comparison</h3>
              <p className="text-sm text-gray-600">Reconstruction accuracy and confidence</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Official NAV:</span>
              </div>
              <span className="text-sm font-mono text-gray-900">
                {formatCurrency(summary.officialNav)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Reconstructed NAV:</span>
              </div>
              <span className="text-sm font-mono text-gray-900">
                {formatCurrency(summary.reconstructedNav)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Confidence:</span>
              </div>
              <span className="text-sm font-mono text-gray-900">
                {reconstruction.confidence}%
              </span>
            </div>
          </div>

          {reconstruction.calculationSteps.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Calculation Steps:</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="text-sm text-gray-700 space-y-2">
                  {reconstruction.calculationSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-primary-600 font-mono text-xs mt-1 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-warning-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Anomaly Detection</h3>
              <p className="text-sm text-gray-600">AI-powered risk assessment</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${getSeverityColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getSeverityIcon}
                <span className="font-medium capitalize">{comparison.severity} Severity</span>
              </div>
              <p className="text-sm leading-relaxed">{comparison.explanation}</p>
            </div>

            {comparison.anomalies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Detected Anomalies:</h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="text-sm text-gray-700 space-y-2">
                    {comparison.anomalies.map((anomaly, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-danger-600 font-mono text-xs mt-1 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{anomaly}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {comparison.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations:</h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="text-sm text-gray-700 space-y-2">
                    {comparison.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-success-600 font-mono text-xs mt-1 flex-shrink-0">•</span>
                        <span className="leading-relaxed">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NAV Explanation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">NAV Explanation</h3>
            <p className="text-sm text-gray-600">Detailed analysis and insights</p>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {explanation.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        
        {summary.requiresInvestigation && (
          <Button
            variant="warning"
            size="lg"
          >
            <Flag className="h-4 w-4 mr-2" />
            Flag for Investigation
          </Button>
        )}
        
        <Button
          variant="secondary"
          size="lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Raw Data
        </Button>
      </div>
    </div>
  );
};

export default NAVAnalysis; 