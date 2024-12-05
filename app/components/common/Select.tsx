import { Dispatch } from "react";

interface SelectProps {
  label: string;
  name: string;
  options: {
    key: any;
    value: any;
  }[];
  value?: string;
  required?: boolean;
  setState?: Dispatch<string>;
  [key: string]: any;
}

export default function Select(props: SelectProps) {
  const { name, label, required, options, setState } = props;

  return (
    <div className="space-y-3 flex flex-col">
      <label htmlFor={name} className="font-bold">
        {label}
        <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
      </label>
      <select
        {...props}
        className="border p-3 rounded-lg focus:ring-blue-600 focus:border-blue-600"
      >
        {options.map((option) => (
          <option value={`${option.value}`}>{`${option.key}`}</option>
        ))}
      </select>
    </div>
  );
}
