import { Search as SearchIcon } from "./Icons";

interface SearchProps {
  value?: string;
  handleSearch: (term: string) => void;
  placeholder?: string;
}

/**
 * search bar to be used in tables
 */
export default function Search(props: SearchProps) {
  const { handleSearch, placeholder, value } = props;

  return (
    <div className="relative md:w-96">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="h-12 w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        value={value}
        required
      />
    </div>
  );
}
