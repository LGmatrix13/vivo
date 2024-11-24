import { useState } from "react";
import { Download, HomeSearch } from "./Icons";
import Search from "./Search";
import Button from "./Button";

interface TableProps {
  columns: string[];
  rows: {
    [key: string]: any;
  }[];
  options: {
    export: boolean;
    search: boolean;
  };
  SelectedComponent?: (props: any) => React.ReactNode;
  actionButtons?: React.ReactNode[];
}

export default function Table(props: TableProps) {
  const { columns, options, SelectedComponent, actionButtons } = props;
  const [rows, setRows] = useState(props.rows);
  const [opened, setOpened] = useState<number>(-1);
  const [selected, setSelected] = useState<{
    all: boolean;
    indexes: number[];
  }>({
    all: false,
    indexes: [],
  });

  function handleSearch(term: string) {
    setOpened(-1);
    setSelected({
      all: false,
      indexes: [],
    });

    if (term === "") {
      setRows(props.rows);
      return;
    }

    setRows(
      props.rows.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  return (
    <section className="space-y-5 mb-7">
      <div className="flex flex-row">
        {options.search && <Search handleSearch={handleSearch} />}
        {options.export && (
          <div className="ml-auto order-2 space-x-3 flex items-center">
            {(selected.indexes.length > 0 || selected.all) && (
              <Button onClick={() => alert("export")}>
                <div className="space-x-2 flex flex-row items-center">
                  <Download />
                  <span>Export</span>
                </div>
              </Button>
            )}
            {actionButtons && actionButtons.map((actionButton) => actionButton)}
          </div>
        )}
      </div>
      <div className="flex flex-row border rounded-lg divide-x">
        <div className={` w-3/5 min-h-80`}>
          <table className={`text-left table-auto w-full`}>
            <thead className="uppercase border-b bg-gray-100/[.5]">
              <tr>
                {options.export && (
                  <th scope="col" className="px-5 py-3">
                    <input
                      type="checkbox"
                      className="accent-blue-600"
                      onChange={() => {
                        if (
                          selected.all ||
                          selected.indexes.length === rows.length
                        ) {
                          setSelected({
                            all: false,
                            indexes: [],
                          });
                        } else {
                          setSelected({
                            all: true,
                            indexes: rows.map((_, index) => index),
                          });
                        }
                      }}
                      checked={
                        selected.all || selected.indexes.length === rows.length
                      }
                    />
                  </th>
                )}
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
                    opened == rowIndex
                      ? "bg-blue-600/[.05]"
                      : "hover:bg-gray-50"
                  } cursor-pointer transition ease-in-out`}
                  key={rowIndex}
                  onClick={() => setOpened(rowIndex)}
                >
                  {options.export && (
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        onChange={() => {
                          if (!selected.indexes.includes(rowIndex)) {
                            setSelected({
                              all: false,
                              indexes: [...selected.indexes, rowIndex],
                            });
                          } else {
                            setSelected({
                              all: false,
                              indexes: selected.indexes.filter(
                                (index) => index != rowIndex
                              ),
                            });
                          }
                        }}
                        checked={
                          selected.indexes.includes(rowIndex) || selected.all
                        }
                      />
                    </td>
                  )}
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
          <div className="w-2/5 border rounded-r-lg p-5">
            <SelectedComponent {...rows[opened]} />
          </div>
        )}
      </div>
    </section>
  );
}
