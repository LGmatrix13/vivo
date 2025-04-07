import { ChevronDown } from "./Icons";

interface SelectProps {
  label: string;
  name: string;
  options: {
    key: any;
    value: any;
  }[];
  selected?: any;
  value?: string;
  explanation?: string;
  required?: boolean;
  [key: string]: any;
}

/**
 * dropdown to be used in forms
 */
export default function Select(props: SelectProps) {
  const { name, label, required, options, explanation, selected } = props;

  return (
    <div className="space-y-3 flex flex-col w-full appearance-none">
      <label htmlFor={name} className="font-bold">
        {label}
        <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
      </label>
      {explanation && <p>{explanation}</p>}
      <div className="relative border border-gray-300 rounded-lg w-full">
        <select
          className="w-full bg-white p-3 rounded-lg focus:ring-blue-600 appearance-none h-12"
          {...props}
          defaultValue={selected}
        >
          {options.map((option, index) => (
            <option
              key={index}
              value={`${option.value}`}
            >{`${option.key}`}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}
