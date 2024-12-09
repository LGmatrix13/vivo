import { useEffect, useState } from "react";
import { Check } from "./Icons";

type Level = "success" | "failure";

interface Toast {
  level: Level;
  message: string;
}

interface ToastProps {
  level: Level;
  children: React.ReactNode;
}

export function Toast(props: ToastProps) {
  const [show, setShow] = useState(false);
  const { level, children } = props;
  const background = level === "success" ? "bg-green-600" : "bg-red-600";

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShow(true);
    }, 100);
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      className={`${background} fixed bottom-5 left-5 p-3 rounded-lg text-white transition-all ease-in-out min-w-56 duration-300 flex items-center space-x-2 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {level === "success" && <Check className="w-5 h-5" />}
      <span>{children}</span>
    </div>
  );
}
