import React from "react";
import { Check, ExclamationMark, Stopwatch } from "./Icons";

interface InsightProps {
  level: "WARNING" | "SUCCESS" | "DANGER" | "TIME_SENSITIVE";
  title: string;
  explanation?: string;
}

export default function Insight(props: InsightProps) {
  const { level, title, explanation } = props;
  return (
    <div className={`space-x-3 flex ${!explanation ? "items-center" : ""}`}>
      <div
        className={`${
          level === "WARNING"
            ? "bg-orange-600"
            : level === "SUCCESS"
            ? "bg-green-600"
            : level === "DANGER"
            ? "bg-red-600"
            : "bg-blue-600"
        } h-7 w-7 rounded-full text-white justify-center
         items-center flex`}
      >
        {level === "SUCCESS" ? (
          <Check />
        ) : level === "TIME_SENSITIVE" ? (
          <Stopwatch />
        ) : (
          <ExclamationMark />
        )}
      </div>
      <div className="space-y-2 flex flex-col">
        <h2 className="font-bold">{title}</h2>
        {explanation && <span>{explanation}</span>}
      </div>
    </div>
  );
}
