interface TextareaProps {
  label?: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  cols?: number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  setState?: (value: string) => void;
  [key: string]: any;
}

/**
 * generic textarea for forms
 */
export default function Textarea(props: TextareaProps) {
  const { name, label, required, defaultValue, setState } = props;

  return (
    <div className="space-y-3 flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
          <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
        </label>
      )}
      <textarea
        {...props}
        defaultValue={defaultValue}
        onChange={(e) => {
          setState && setState(e.target.value);
        }}
        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-600 focus:border-blue-600"
      />
    </div>
  );
}
