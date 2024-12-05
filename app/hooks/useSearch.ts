import { useState } from "react";

// TODO: only serach by columnKeys
export default function useSearch<T extends Object>(data: T[]) {
  const [filteredData, setFilteredData] = useState<T[] | null>(null);

  function handleSearch(term: string) {
    if (term === "") {
      return setFilteredData(null);
    }

    const lowerCaseTerm = term.toLowerCase();
    setFilteredData(() =>
      data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
  }

  return {
    handleSearch,
    filteredData,
  };
}
