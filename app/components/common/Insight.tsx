import { Check, ExclamationMark } from "./Icons";
import { IInsight } from "~/models/insights";

interface InsightProps {
  insight: IInsight;
}

export default function Insight(props: InsightProps) {
  const { insight } = props;
  return (
    <div className={`space-x-3 flex ${!insight.title ? "items-center" : ""}`}>
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
        <h2>{insight.title}</h2>
      </div>
    </div>
  );
}
