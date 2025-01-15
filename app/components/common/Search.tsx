import { Search as SearchIcon } from "./Icons";

interface SearchProps {
  handleSearch: (term: string) => void;
  placeholder?: string;
}

export default function Search(props: SearchProps) {
  const { handleSearch, placeholder } = props;

  return (
    <div className="relative md:w-96">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="h-12 w-full p-3 ps-10 text-sm text-gray-900 border rounded-lg focus:outline-none"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        required
      />
    </div>
  );
}
