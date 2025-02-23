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
}

export default function InsightsTable(props: IInsightsTable) {
  const { filter, rows } = props;

  return (
    <Table<IInsights>
      columnKeys={{
        category: "Category",
      }}
      enableReads={false}
      rows={rows}
      InstructionComponent={() => (
        <Instruction title="First Select a Category" />
      )}
      mixins={{
        cells: {
          category: (row) => {
            const { category, insights } = row;
            return (
              <div className="space-x-3 flex items-center">
                <span>{category}</span>
                <div className="bg-blue-600 w-6 h-6 rounded-full flex justify-center items-center">
                  <span className="text-xs text-white">{insights.length}</span>
                </div>
              </div>
            );
          },
        },
      }}
      SelectedRowComponent={({ row }) => (
        <div>
          {row.insights.map((insight) => (
            <Insight insight={insight} />
          ))}
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
