import { useState } from "react";
import SelectedRow from "./SelectedRow";
import { ArrowNarrowDown, ArrowNarrowUp, Pencil, Trash } from "./Icons";
import { DrawerProvider, DrawerButton, DrawerContent } from "./Drawer";

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
  EditComponent?: () => React.ReactElement;
  DeleteComponent?: () => React.ReactElement;
}

export default function Table(props: TableProps) {
  const {
    rows,
    rowKeys,
    columnKeys,
    InstructionComponent,
    DeleteComponent,
    EditComponent,
  } = props;
  const originalColumnKeys = Object.keys(columnKeys);
  const [opened, setOpened] = useState<number>(-1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Sort rows based on the sortConfig
  const sortedRows = [...rows].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (columnKey: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === columnKey) {
        // Toggle the direction if the column is already being sorted
        return {
          key: columnKey,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      // Default to ascending order for a new column
      return { key: columnKey, direction: "asc" };
    });
  };

  return (
    <div className="flex flex-row border rounded-lg divide-x overflow-hidden">
      <div className="w-3/5 h-96 overflow-y-auto">
        <table className="text-left table-auto w-full">
          <thead className="sticky top-0 uppercase border-b bg-gray-50 z-10">
            <tr>
              {originalColumnKeys.map((originalColumnKey, index) => (
                <th
                  scope="col"
                  className="px-5 py-3 cursor-pointer"
                  key={index}
                  onClick={() => handleSort(originalColumnKey)}
                >
                  <div className="space-x-2 flex flex-row items-center">
                    <span>{columnKeys[originalColumnKey]}</span>
                    {sortConfig?.key === originalColumnKey ? (
                      <>
                        {sortConfig.direction === "asc" ? (
                          <ArrowNarrowUp className="w-5 h-5" />
                        ) : (
                          <ArrowNarrowDown className="w-5 h-5" />
                        )}
                      </>
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </div>
                </th>
              ))}
              {(EditComponent || DeleteComponent) && <th scope="col" />}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr
                className={`${
                  rowIndex + 1 < rows.length &&
                  "border-b border-l-blue-600 border-l-2"
                } ${
                  opened === rowIndex ? "bg-gray-50" : "hover:bg-gray-50"
                } transition ease-in-out`}
                key={rowIndex}
              >
                {originalColumnKeys.map((originalColumnKey, colIndex) => (
                  <td
                    className="px-5 py-3 cursor-pointer"
                    onClick={() => setOpened(rowIndex)}
                    key={colIndex}
                  >
                    {row[originalColumnKey]}
                  </td>
                ))}
                {(EditComponent || DeleteComponent) && (
                  <td className="px-5 py-3 space-x-2 flex">
                    {EditComponent && (
                      <DrawerProvider>
                        <DrawerContent>
                          <EditComponent />
                        </DrawerContent>
                        <DrawerButton>
                          <button>
                            <Pencil className="w-5 h-5" />
                          </button>
                        </DrawerButton>
                      </DrawerProvider>
                    )}
                    {DeleteComponent && (
                      <DrawerProvider>
                        <DrawerContent>
                          <DeleteComponent />
                        </DrawerContent>
                        <DrawerButton>
                          <button>
                            <Trash className="w-5 h-5" />
                          </button>
                        </DrawerButton>
                      </DrawerProvider>
                    )}
                  </td>
                )}
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
