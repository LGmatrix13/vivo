interface InputProps {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  explanation?: string;
  defaultValue?: string | number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

/**
 * generic input to use inside of forms
 */
export default function Input(props: InputProps) {
  const { name, label, explanation, required } = props;

  return (
    <div className="space-y-3 flex flex-col">
      {label && (
        <label htmlFor={name}>
          <span className="font-bold">{label}</span>
          <span className="text-red-600 text-sm"> {required ? "*" : ""}</span>
        </label>
      )}
      {explanation && <p>{explanation}</p>}
      <input
        {...props}
        maxLength={220}
        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-600 focus:border-blue-600 placeholder:text-gray-300 h-12"
      />
    </div>
  );
}
