import { ChevronDown } from "./Icons";

interface FilterProps {
  options: {
    key: string;
    value: number;
  }[];
  selected: any;
  handleFilter: (id: number) => void;
}

export default function Filter(props: FilterProps) {
  const { options, selected, handleFilter } = props;

  return (
    <div className="relative border rounded-lg">
      <select
        className="md:w-40 w-full bg-white p-2 h-12 items-center rounded-lg focus:ring-blue-600 appearance-none"
        defaultValue={selected}
        onChange={(e) => {
          handleFilter(Number(e.target.value));
        }}
        aria-label="Filter"
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={`${option.value}`}
          >{`${option.key}`}</option>
        ))}
      </select>
      <div className="h-12 absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
        <ChevronDown />
      </div>
    </div>
  );
}
