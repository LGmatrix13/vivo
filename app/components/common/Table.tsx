import React, { useEffect, useState } from "react";
import SelectedRow from "./SelectedRow";
import { ArrowNarrowDown, ArrowNarrowUp, Close, Pencil, Trash } from "./Icons";
import { DrawerProvider, DrawerButton, DrawerContent } from "./Drawer";
import Search from "./Search";
import Filter from "./Filter";
import { useSearchParams } from "@remix-run/react";

interface TableProps<T> {
  columnKeys: Record<string, string>;
  rows: T[];
  rowKeys?: Record<string, string>;
  search?: {
    placeholder: string;
  };
  filter?: {
    selected: string;
    key: string;
    options: {
      value: number;
      key: string;
    }[];
  };
  mixins?: {
    cells?: Record<string, (row: T) => React.ReactElement>;
    selectedRows?: Record<string, (row: T) => React.ReactElement>;
  };
  enableReads?: boolean;
  ActionButtons?: (props: { rows: T[] }) => React.ReactElement;
  InstructionComponent: () => React.ReactElement;
  EditComponent?: (props: { row: T }) => React.ReactElement;
  DeleteComponent?: (props: { row: T }) => React.ReactElement;
  SelectedRowComponent?: (props: { row: T }) => React.ReactElement;
  onRowRead?: (args: { row: T }) => void;
}

export default function Table<T extends { [key: string]: any; read?: boolean }>(
  props: TableProps<T>
) {
  const {
    rows,
    rowKeys,
    columnKeys,
    search,
    filter,
    ActionButtons,
    InstructionComponent,
    DeleteComponent,
    EditComponent,
    SelectedRowComponent,
    mixins = {},
    onRowRead = () => {},
    enableReads = false,
  } = props;
  const [searchParams] = useSearchParams();
  const { cells } = mixins;
  const originalColumnKeys = Object.keys(columnKeys);
  const [opened, setOpened] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOption, setFilterOption] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  
  
  let prefilteredRows = rows;

  if (rows.length > 0) {
    const filters: Record<string, string | null> = {}
    for (const key of Object.keys(rows[0])) {
      filters[key] = searchParams.get(key)
    }
  
    prefilteredRows = rows.filter((row) => {
      return Object.keys(filters).some((key) => {
        if (key) {
          return String(row[key]).toLowerCase().includes(filters[key] as string);
        } else {
          return true;
        }
      })
    })
    console.log(prefilteredRows)
  }


  // Filter rows based on the selected filter

  const filteredRows =
    filter && filterOption
      ? prefilteredRows.filter((row) => row[filter.key] === filterOption)
      : prefilteredRows;
  const [readRows, setReadRows] = useState<number[]>(
    rows.filter((row) => row.read).map((row) => row.id)
  );

  
 // Search rows based on the search query
  const searchedRows = filteredRows.filter((row) =>
    originalColumnKeys.some((key) =>
      String(row[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  // Sort rows based on the sortConfig
  const sortedRows = [...searchedRows].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setOpened(-1);
    setSortConfig((prev) => ({
      key,
      direction: prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setOpened(-1);
    setSearchTerm(searchTerm);
  };

  const handleFilter = (id: number) => {
    setOpened(-1);
    setFilterOption(id);
  };

  return (
    <section className="space-y-5">
      {(filter || search || ActionButtons) && (
        <div className="md:flex md:space-y-0 md:justify-between space-y-3">
          <div className="md:flex md:space-y-0 md:space-x-3 space-y-3">
            {filter && (
              <Filter
                options={filter.options}
                selected={filterOption}
                handleFilter={handleFilter}
              />
            )}
            {search && (
              <Search
                placeholder={search.placeholder}
                handleSearch={handleSearch}
                value={searchTerm}
              />
            )}
          </div>
          {ActionButtons && <ActionButtons rows={sortedRows} />}
        </div>
      )}
      <div className="flex flex-row border rounded-lg md:divide-x h-[600px] overflow-y-auto">
        <div
          className={`md:w-3/5 w-full md:overflow-y-auto ${
            opened >= 0 ? "hidden md:block" : ""
          }`}
          tabIndex={0}
        >
          <table className="text-left table-fixed w-full">
            <thead className="uppercase border-b">
              <tr>
                {enableReads && <td className="w-[2px]" />}
                {originalColumnKeys.map((originalColumnKey, index) => (
                  <th
                    scope="col"
                    className={`px-5 py-3 cursor-pointer ${
                      index > 1 ? "hidden md:table-cell" : ""
                    }`}
                    key={index}
                    onClick={() => handleSort(originalColumnKey)}
                  >
                    <div className="space-x-2 flex flex-row items-center">
                      <span>{columnKeys[originalColumnKey]}</span>
                      {sortConfig?.key === originalColumnKey ? (
                        <>
                          {sortConfig.direction === "asc" ? (
                            <ArrowNarrowUp />
                          ) : (
                            <ArrowNarrowDown />
                          )}
                        </>
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </th>
                ))}
                {EditComponent && <td className="w-5" />}
                {EditComponent && DeleteComponent && <td className="w-2" />}
                {DeleteComponent && <td className="w-5" />}
                {DeleteComponent && <td className="w-5" />}
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedRows.map((row, rowIndex) => (
                <tr
                  className={`${
                    opened === rowIndex ? "bg-gray-50" : "hover:bg-gray-50"
                  } transition ease-in-out`}
                  key={rowIndex}
                >
                  {enableReads && !readRows.includes(row.id) ? (
                    <td className="bg-blue-600" />
                  ) : enableReads ? (
                    <td />
                  ) : null}
                  {originalColumnKeys.map((originalColumnKey, colIndex) => (
                    <td
                      className={`px-5 py-3 cursor-pointer ${
                        colIndex > 1 ? "hidden md:table-cell" : ""
                      }`}
                      onClick={() => {
                        if (!readRows.includes(row.id)) {
                          setReadRows([...readRows, row.id]);
                          onRowRead({ row });
                        }
                        setOpened(rowIndex);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      key={colIndex}
                    >
                      {cells && cells[originalColumnKey] ? (
                        cells[originalColumnKey](row)
                      ) : (
                        <>
                          {row[originalColumnKey] === null ||
                          row[originalColumnKey] === undefined
                            ? "-"
                            : row[originalColumnKey]}
                        </>
                      )}
                    </td>
                  ))}
                  {EditComponent && (
                    <td className="py-3">
                      <DrawerProvider>
                        <DrawerContent>
                          <EditComponent row={row} />
                        </DrawerContent>
                        <DrawerButton>
                          <button>
                            <Pencil />
                          </button>
                        </DrawerButton>
                      </DrawerProvider>
                    </td>
                  )}
                  {EditComponent && <td />}
                  {DeleteComponent && (
                    <td className="py-3">
                      <DrawerProvider>
                        <DrawerContent>
                          <DeleteComponent row={row} />
                        </DrawerContent>
                        <DrawerButton>
                          <button>
                            <Trash />
                          </button>
                        </DrawerButton>
                      </DrawerProvider>
                    </td>
                  )}
                  {DeleteComponent && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {opened < 0 && InstructionComponent && <InstructionComponent />}
        {opened >= 0 && rows.length > opened && (
          <div className="md:w-2/5 w-full p-5 overflow-y-auto">
            <div className="flex">
              <button className="ml-auto order-2" onClick={() => setOpened(-1)}>
                <Close />
              </button>
            </div>
            {SelectedRowComponent ? (
              <SelectedRowComponent row={sortedRows[opened]} />
            ) : rowKeys ? (
              <SelectedRow row={sortedRows[opened]} keys={rowKeys} />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
