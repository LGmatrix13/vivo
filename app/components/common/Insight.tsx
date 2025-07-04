import { Link } from "@remix-run/react";
import { Check, ExclamationMark } from "./Icons";
import { IInsight } from "~/models/insights";

interface InsightProps {
  insight: IInsight;
}

/**
 * an insight to be used inside the insights table
 */
export default function Insight(props: InsightProps) {
  const { insight } = props;
  return (
    <div className="flex flex-col space-y-3">
      <div
        className={`space-x-3 flex flex-col ${
          !insight.title ? "items-center" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`${
              insight.level === "warning"
                ? "bg-orange-600"
                : insight.level === "great"
                ? "bg-green-600"
                : insight.level === "danger"
                ? "bg-red-600"
                : "bg-blue-600"
            } h-7 w-7 rounded-full text-white justify-center
         items-center flex`}
          >
            {insight.level === "great" ? (
              <Check />
            ) : insight.level === "warning" ? (
              <ExclamationMark />
            ) : (
              <ExclamationMark />
            )}
          </div>
          <div className="space-y-2 flex flex-col">
            <h2 className="font-bold">
              {insight.href ? (
                <Link to={insight.href} className="font-bold hover:underline">
                  {insight.title}
                </Link>
              ) : (
                <span>{insight.title}</span>
              )}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
