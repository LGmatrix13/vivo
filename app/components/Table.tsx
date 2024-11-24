import { useState } from "react";
import { HomeSearch } from "./Icons";

interface TableProps {
  columns: string[];
  rows: {
    [key: string]: any;
  }[];
  SelectedComponent?: (props: any) => React.ReactNode;
}

export default function Table(props: TableProps) {
  const { rows, columns, SelectedComponent } = props;
  const [opened, setOpened] = useState<number>(-1);

  return (
    <div className="flex flex-row border rounded-lg divide-x overflow-hidden">
      <div className="w-3/5 min-h-80">
        <table className="text-left table-auto w-full">
          <thead className="uppercase border-b bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th scope="col" className="px-5 py-3" key={index}>
                  <div className="space-x-2 flex flex-row items-center">
                    <span>{column}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                className={`${
                  rowIndex + 1 < rows.length &&
                  "border-b border-l-blue-600 border-l-2"
                } ${
                  opened == rowIndex ? "bg-blue-600/[.05]" : "hover:bg-gray-50"
                } cursor-pointer transition ease-in-out`}
                key={rowIndex}
                onClick={() => setOpened(rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td className="px-5 py-3" key={colIndex}>
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {opened < 0 && (
        <div className="w-2/5 p-5 space-y-3 flex flex-col items-center justify-center">
          <HomeSearch className="w-7 h-7" />
          <h2 className="text-xl font-bold">First Open a Building</h2>
        </div>
      )}
      {SelectedComponent && opened >= 0 && (
        <div className="w-2/5 p-5">
          <SelectedComponent {...rows[opened]} />
        </div>
      )}
    </div>
  );
}
