/**
 * Status Badge Component
 * Professional status indicator with consistent styling and icons
 */

import React from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Clock,
  Shield
} from "lucide-react";

type StatusType = "success" | "warning" | "error" | "info" | "pending" | "critical";

interface StatusBadgeProps {
  type: StatusType;
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  type, 
  text, 
  size = "md", 
  className = "" 
}) => {
  const statusConfig = {
    success: {
      colors: "bg-success-50 text-success-700 border-success-200",
      icon: <CheckCircle className="h-4 w-4" />
    },
    warning: {
      colors: "bg-warning-50 text-warning-700 border-warning-200",
      icon: <AlertTriangle className="h-4 w-4" />
    },
    error: {
      colors: "bg-danger-50 text-danger-700 border-danger-200",
      icon: <XCircle className="h-4 w-4" />
    },
    info: {
      colors: "bg-primary-50 text-primary-700 border-primary-200",
      icon: <Info className="h-4 w-4" />
    },
    pending: {
      colors: "bg-gray-50 text-gray-700 border-gray-200",
      icon: <Clock className="h-4 w-4" />
    },
    critical: {
      colors: "bg-danger-50 text-danger-700 border-danger-200",
      icon: <Shield className="h-4 w-4" />
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const config = statusConfig[type];

  return (
    <div className={`
      inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border font-medium
      ${config.colors} ${sizeClasses[size]} ${className}
    `}>
      {config.icon}
      <span>{text}</span>
    </div>
  );
};

export default StatusBadge; 