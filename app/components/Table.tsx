import { useState } from "react";
import SelectedRow from "./SelectedRow";

interface TableProps {
  columnKeys: {
    [key: string]: string;
  };
  rows: {
    [key: string]: any;
  }[];
  rowKeys: {
    [key: string]: string;
  };
  InstructionComponent?: () => React.ReactElement;
}

export default function Table(props: TableProps) {
  const { rows, rowKeys, columnKeys, InstructionComponent } = props;
  const originalColumnKeys = Object.keys(columnKeys);
  const [opened, setOpened] = useState<number>(-1);

  return (
    <div className="flex flex-row border rounded-lg divide-x overflow-hidden">
      <div className="w-3/5 min-h-80">
        <table className="text-left table-auto w-full">
          <thead className="uppercase border-b bg-gray-50">
            <tr>
              {originalColumnKeys.map((originalColumnKey, index) => (
                <th scope="col" className="px-5 py-3" key={index}>
                  <div className="space-x-2 flex flex-row items-center">
                    <span>{columnKeys[originalColumnKey]}</span>
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
                  opened == rowIndex ? "bg-gray-50" : "hover:bg-gray-50"
                } cursor-pointer transition ease-in-out`}
                key={rowIndex}
                onClick={() => setOpened(rowIndex)}
              >
                {originalColumnKeys.map((originalColumnKey, colIndex) => (
                  <td className="px-5 py-3" key={colIndex}>
                    {row[originalColumnKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {opened < 0 && InstructionComponent && <InstructionComponent />}
      {opened >= 0 && rows.length > opened && (
        <div className="w-2/5 p-5">
          <SelectedRow keys={rowKeys} row={rows[opened]} />
        </div>
      )}
    </div>
  );
}
