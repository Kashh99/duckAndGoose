/**
 * File Upload Component
 * Professional drag-and-drop file upload with enhanced visual feedback
 * Supports PDF files with comprehensive error handling and validation
 */

import React, { useCallback, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Download,
  Shield,
  Clock
} from "lucide-react";
import { NAVData } from "../types";

interface FileUploadProps {
  onFileUpload: (navData: NAVData) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  onError, 
  isLoading = false 
}) => {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("navDocument", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      if (result.success) {
        setUploadStatus("success");
        onFileUpload(result.navData);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      setUploadStatus("error");
      setUploadProgress(0);
      onError(error instanceof Error ? error.message : "Upload failed");
    }
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isLoading
  });

  const fileRejection = fileRejections[0];

  const getStatusIcon = useMemo(() => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary-600" />
            </div>
          </div>
        );
      case "success":
        return <CheckCircle className="h-8 w-8 text-success-600" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-danger-600" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  }, [uploadStatus]);

  const getStatusText = useMemo(() => {
    switch (uploadStatus) {
      case "uploading":
        return "Processing NAV document...";
      case "success":
        return "Document uploaded successfully!";
      case "error":
        return "Upload failed. Please try again.";
      default:
        return isDragActive ? "Drop the PDF here" : "Drag & drop a NAV PDF, or click to select";
    }
  }, [uploadStatus, isDragActive]);

  const getBorderColor = useMemo(() => {
    if (isDragReject) return "border-danger-300 bg-danger-50";
    if (isDragActive) return "border-primary-300 bg-primary-50";
    if (uploadStatus === "success") return "border-success-300 bg-success-50";
    if (uploadStatus === "error") return "border-danger-300 bg-danger-50";
    return "border-gray-300 bg-white hover:border-primary-400";
  }, [isDragReject, isDragActive, uploadStatus]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-[1.02]
          ${getBorderColor}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragActive ? "scale-105" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-6">
          {getStatusIcon}
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {uploadStatus === "success" ? "Document Ready" : "Upload NAV Document"}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getStatusText}
            </p>
          </div>

          {/* Upload Progress */}
          {uploadStatus === "uploading" && (
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* File Info */}
          {uploadedFile && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900 truncate max-w-xs">
                  {uploadedFile.name}
                </div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
              {uploadStatus === "success" && (
                <CheckCircle className="h-5 w-5 text-success-600" />
              )}
            </div>
          )}

          {/* Upload Guidelines */}
          {uploadStatus === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>PDF format only</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Max 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Rejection Error */}
      {fileRejection && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <X className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-danger-800 mb-1">
                File Upload Error
              </h4>
              <ul className="text-sm text-danger-700 space-y-1">
                {fileRejection.errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-danger-600 font-mono text-xs mt-1">•</span>
                    <span>{error.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadStatus === "error" && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-danger-800 mb-1">
                Upload Failed
              </h4>
              <p className="text-sm text-danger-700">
                Please ensure you're uploading a valid NAV PDF document. 
                The file should be in PDF format and contain NAV calculation data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === "success" && (
        <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-success-800 mb-1">
                Upload Successful
              </h4>
              <p className="text-sm text-success-700">
                NAV document processed successfully. Ready for analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {uploadStatus === "idle" && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need help? Check our documentation for supported file formats
          </p>
          <button className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors">
            <Download className="h-4 w-4 mr-1" />
            Download Sample NAV Document
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 