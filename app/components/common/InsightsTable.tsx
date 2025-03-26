import { IInsights } from "~/models/insights";
import Instruction from "./Instruction";
import Table from "./Table";
import Insight from "./Insight";

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

export default function InsightsTable(props: IInsightsTable) {
  const { filter, rows, ActionButtons } = props;

  return (
    <Table<IInsights>
      columnKeys={{
        category: "Insight",
      }}
      enableReads={false}
      rows={rows}
      InstructionComponent={() => (
        <Instruction title="First Select an Insight" />
      )}
      ActionButtons={ActionButtons && (() => <ActionButtons />)}
      mixins={{
        cells: {
          category: (row) => {
            const { category, insights } = row;
            const count = insights.length;
            return (
              <div className="space-x-3 flex items-center">
                <span>{category}</span>
                {count > 0 && (
                  <div className="bg-blue-600 w-6 h-6 rounded-full flex justify-center items-center">
                    <span className="text-xs text-white">!</span>
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
