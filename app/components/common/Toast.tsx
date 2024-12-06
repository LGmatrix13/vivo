import { createContext, useContext, useEffect, useState } from "react";
import { Check } from "./Icons";

type Level = "success" | "failure";

interface Toast {
  level: Level;
  message: string;
}

interface ToastProps {
  level: Level;
  children: React.ReactNode;
  clearToast: () => void;
}

export function Toast(props: ToastProps) {
  const [show, setShow] = useState(false);
  const { level, children, clearToast } = props;
  const background = level === "success" ? "bg-green-600" : "bg-red-600";

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShow(true);
    }, 100);
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 3500);
    const timer3 = setTimeout(() => {
      clearToast();
    }, 3800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className={`${background} p-3 rounded-lg text-white transition-all ease-in-out min-w-56 duration-300 flex items-center space-x-2 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <Check className="w-5 h-5" />
      <span>{children}</span>
    </div>
  );
}

interface ToastContextType {
  success: (message: string) => void;
  failure: (message: string) => void;
}

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>();

  function success(message: string) {
    setToast({
      level: "success",
      message: message,
    });
  }

  function failure(message: string) {
    setToast({
      level: "failure",
      message: message,
    });
  }

  function clearToast() {
    setToast(null);
  }

  return (
    <ToastContext.Provider value={{ success, failure }}>
      {children}
      {toast && (
        <div className="absolute left-5 bottom-5">
          <Toast level={toast.level}>{toast.message}</Toast>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};
