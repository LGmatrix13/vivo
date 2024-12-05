import { Dispatch } from "react";

interface InputProps<T> {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  value?: T;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  setState?: Dispatch<string>;
  [key: string]: any;
}

export default function Input<T>(props: InputProps<T>) {
  const { name, label, required, setState } = props;

  return (
    <div className="space-y-3 flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
          <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
        </label>
      )}
      <input
        {...props}
        value={props.value ? `${props.value}` : undefined}
        className="border p-2 rounded-lg focus:ring-blue-600 focus:border-blue-600"
        onChange={(e) => setState && setState(e.target.value)}
      />
    </div>
  );
}
