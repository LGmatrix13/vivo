import { useState } from "react";

export default function useSearch<T extends Object>(data: T[]) {
  const [filteredData, setFilteredData] = useState(data);

  function handleSearch(term: string) {
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
