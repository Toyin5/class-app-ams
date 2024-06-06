import React from "react";

export interface ToastProps {
  variant: "info" | "error" | "success";
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  variant,
  message,
  isVisible,
}) => {
  return isVisible ? (
    <div className="toast toast-top toast-center">
      <div className={`alert alert-${variant}`} role="alert">
        <span>{message}</span>
      </div>
    </div>
  ) : null;
};
