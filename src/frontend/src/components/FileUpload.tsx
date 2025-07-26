/**
 * File Upload Component
 * Handles PDF file upload with drag-and-drop functionality
 */

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadStatus("uploading");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("navDocument", file);

      // Simulate API call (replace with actual API call)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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
      onError(error instanceof Error ? error.message : "Upload failed");
    }
  }, [onFileUpload, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>;
      case "success":
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-danger-600" />;
      default:
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
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
  };

  const getBorderColor = () => {
    if (isDragReject) return "border-danger-300 bg-danger-50";
    if (isDragActive) return "border-primary-300 bg-primary-50";
    if (uploadStatus === "success") return "border-success-300 bg-success-50";
    if (uploadStatus === "error") return "border-danger-300 bg-danger-50";
    return "border-gray-300 bg-white hover:border-primary-400";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${getBorderColor()}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {uploadStatus === "success" ? "Document Ready" : "Upload NAV Document"}
            </h3>
            <p className="text-sm text-gray-600">
              {getStatusText()}
            </p>
          </div>

          {uploadedFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{uploadedFile.name}</span>
              <span className="text-gray-400">
                ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          {uploadStatus === "idle" && (
            <div className="text-xs text-gray-500">
              Supports PDF files up to 10MB
            </div>
          )}
        </div>
      </div>

      {uploadStatus === "error" && (
        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-danger-600" />
            <span className="text-sm text-danger-800">
              Please ensure you're uploading a valid NAV PDF document.
            </span>
          </div>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <span className="text-sm text-success-800">
              NAV document processed successfully. Ready for analysis.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 