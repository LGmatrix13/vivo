import { IInsights } from "~/models/insights";
import Instruction from "./Instruction";
import Table from "./Table";
import Insight from "./Insight";
import { ExclamationMark } from "./Icons";

interface IInsightsTable {
  rows: IInsights[];
  filter?: {
    options: {
      key: string;
      value: number;
    }[];
  };
  ActionButtons?: () => React.ReactNode;
}

/**
 * a table of insights for the insights page
 */
export default function InsightsTable(props: IInsightsTable) {
  const { filter, rows, ActionButtons } = props;
  const nonemptyInsights = rows.filter((row) => row.insights.length > 0);
  return (
    <Table<IInsights>
      columnKeys={{
        category: "Insight",
      }}
      enableReads={false}
      rows={nonemptyInsights}
      InstructionComponent={() => (
        <Instruction title="First Select an Insight" />
      )}
      ActionButtons={ActionButtons && (() => <ActionButtons />)}
      mixins={{
        cells: {
          category: (row) => {
            const { category, insights } = row;
            const countDanger = insights.filter(
              (insight) => insight.level === "danger"
            ).length;
            const countWarning = insights.filter(
              (insight) => insight.level === "warning"
            ).length;
            const color =
              countDanger > 0
                ? "bg-red-700"
                : countWarning
                ? "bg-orange-500"
                : null;
            return (
              <div className="space-x-3 flex items-center">
                <span>{category}</span>
                {color && (
                  <div
                    className={`${color} w-6 h-6 rounded-full flex justify-center items-center text-white`}
                  >
                    <ExclamationMark className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          },
        },
      }}
      SelectedRowComponent={({ row }) => (
        <div className="space-y-5">
          {row.insights.map((insight) => (
            <Insight insight={insight} />
          ))}
          {row.ActionButton && <row.ActionButton />}
        </div>
      )}
      filter={
        filter
          ? {
              selected: "All",
              key: "buildingId",
              options: filter.options,
            }
          : undefined
      }
    />
  );
}
