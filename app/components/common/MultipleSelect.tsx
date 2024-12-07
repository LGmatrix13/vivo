import { Dispatch } from "react";
import { ChevronDown } from "./Icons";

interface MultipleSelectProps {
  label: string;
  name: string;
  options: {
    key: any;
    value: any;
  }[];
  value?: string;
  multiple?: boolean;
  selected?: any[];
  required?: boolean;
  [key: string]: any;
}

export default function MultipleSelect(props: MultipleSelectProps) {
  const { name, label, required, options, selected } = props;

  return (
    <div className="space-y-3 flex flex-col">
      <label htmlFor={name} className="font-bold">
        {label}
        <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
      </label>
      <select
        className="w-full p-3 rounded-lg focus:ring-blue-600 border appearance-none"
        {...props}
        multiple
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={`${option.value}`}
            selected={selected?.includes(option.key)}
          >{`${option.key}`}</option>
        ))}
      </select>
    </div>
  );
}
