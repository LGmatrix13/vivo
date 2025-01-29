import { Dispatch } from "react";

interface TextareaProps {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  setState?: Dispatch<string>;
  [key: string]: any;
}

export default function Textarea(props: TextareaProps) {
  const { name, label, required, setState } = props;

  return (
    <div className="space-y-3 flex flex-col">
      <label htmlFor={name} className="font-bold">
        {label}
        <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
      </label>
      <textarea
        {...props}
        className="border p-2 rounded-lg focus:ring-blue-600 focus:border-blue-600"
        onChange={(e) => setState && setState(e.target.value)}
      />
    </div>
  );
}
