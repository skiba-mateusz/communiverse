import React, { createContext, useContext, useState } from "react";

export type ToastType = "success" | "error";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextState {
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextState | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string) => {
    setToasts((prev) => [...prev, { id: prev.length + 1, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast used outsied its provider");
  }

  return context;
};

export const useToasts = () => {
  const { addToast } = useToast();

  return {
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
  };
};
