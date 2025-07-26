/**
 * Card Component
 * Professional card container with consistent styling and layout options
 */

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  padding = "md",
  shadow = "sm",
  border = true,
  rounded = "lg"
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };

  const roundedClasses = {
    none: "",
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };

  const baseClasses = "bg-white";
  const borderClasses = border ? "border border-gray-200" : "";

  return (
    <div className={`
      ${baseClasses}
      ${borderClasses}
      ${paddingClasses[padding]}
      ${shadowClasses[shadow]}
      ${roundedClasses[rounded]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card; 