"use client";

import React from "react";
import { Toast } from "../Toast";
import type { ToastProps } from "../Toast";

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  className,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 space-y-2 ${className || ""}`}
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};
