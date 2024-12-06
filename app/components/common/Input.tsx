interface InputProps {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export default function Input(props: InputProps) {
  const { name, label, required } = props;

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
        className="border p-2 rounded-lg focus:ring-blue-600 focus:border-blue-600 placeholder:text-gray-300 h-12"
      />
    </div>
  );
}
