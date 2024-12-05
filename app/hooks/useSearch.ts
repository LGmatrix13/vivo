import { useState } from "react";

// Only search by columnKeys
export default function useSearch<T extends Record<string, any>>(
  data: T[],
  columns: string[]
) {
  const [filteredData, setFilteredData] = useState<T[] | null>(null);

  function handleSearch(term: string) {
    if (term === "") {
      return setFilteredData(null);
    }

    const lowerCaseTerm = term.toLowerCase();

    setFilteredData(() =>
      data.filter((row) =>
        columns.some((key) =>
          String(row[key]).toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
  }

  return {
    handleSearch,
    filteredData,
  };
}
