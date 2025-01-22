import { useState } from "react";
import SelectedRow from "./SelectedRow";
import { ArrowNarrowDown, ArrowNarrowUp, Close, Pencil, Trash } from "./Icons";
import { DrawerProvider, DrawerButton, DrawerContent } from "./Drawer";
import Search from "./Search";
import Filter from "./Filter";

interface TableProps<T> {
  columnKeys: Record<string, string>;
  rows: T[];
  rowKeys: Record<string, string>;
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
  ActionButtons?: (props: { rows: T[] }) => React.ReactElement;
  InstructionComponent?: () => React.ReactElement;
  EditComponent?: (props: { row: T }) => React.ReactElement;
  DeleteComponent?: (props: { row: T }) => React.ReactElement;
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
    mixins = {},
    onRowRead = () => {},
  } = props;
  const { cells } = mixins;
  const originalColumnKeys = Object.keys(columnKeys);
  const [opened, setOpened] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOption, setFilterOption] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  // Filter rows based on the selected filter
  const filteredRows =
    filter && filterOption
      ? rows.filter((row) => row[filter.key] === filterOption)
      : rows;
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
        <div className="md:flex md:space-y-0 space-y-5">
          <div className="flex space-x-3">
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
              />
            )}
          </div>
          {ActionButtons && <ActionButtons rows={sortedRows} />}
        </div>
      )}
      <div className="flex flex-row border rounded-lg md:divide-x h-[600px]">
        <div
          className={`md:w-3/5 w-full overflow-y-auto h-[600px] ${
            opened >= 0 ? "hidden md:block" : ""
          }`}
        >
          <table className="text-left table-fixed w-full ">
            <thead className="uppercase border-b">
              <tr>
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
                {EditComponent && <th scope="col" className="w-5" />}
                {EditComponent && DeleteComponent && (
                  <th scope="col" className="w-2" />
                )}
                {DeleteComponent && <th scope="col" className="w-5" />}
                {DeleteComponent && <th scope="col" className="w-5" />}
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedRows.map((row, rowIndex) => (
                <tr
                  className={`${
                    opened === rowIndex ? "bg-gray-50" : "hover:bg-gray-50"
                  } transition ease-in-out ${
                    !readRows.includes(row.id)
                      ? "border-l-4 border-l-blue-600"
                      : "pl-4"
                  }`}
                  key={rowIndex}
                >
                  {originalColumnKeys.map((originalColumnKey, colIndex) => (
                    <td
                      className={`px-5 py-3 cursor-pointer ${
                        colIndex > 1 ? "hidden md:table-cell" : ""
                      }`}
                      onClick={() => {
                        setReadRows([...readRows, rowIndex]);
                        if (!readRows.includes(row.id)) {
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
            <SelectedRow keys={rowKeys} row={rows[opened]} />
          </div>
        )}
      </div>
    </section>
  );
}
