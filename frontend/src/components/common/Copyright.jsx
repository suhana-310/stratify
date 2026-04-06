/*
 * Stratify 2026 - Advanced 3D Project Management System
 * Copyright (c) 2026 Stratify. All rights reserved.
 */

import React from 'react';

const Copyright = ({ className = "", variant = "default" }) => {
  const currentYear = new Date().getFullYear();

  const variants = {
    default: "text-sm text-text-muted",
    footer: "text-xs text-text-muted opacity-75",
    sidebar: "text-xs text-text-muted/60",
    modal: "text-xs text-text-muted text-center"
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      <p>© {currentYear} Stratify. All rights reserved.</p>
      {variant === "footer" && (
        <p className="mt-1">
          Advanced 3D Stratify System
        </p>
      )}
    </div>
  );
};

export default Copyright;