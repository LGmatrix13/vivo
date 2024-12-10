interface WideButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled: boolean;
  options?: {
    [key: string]: any;
  };
}

export default function WideButton(props: WideButtonProps) {
  const { onClick, children, options, className, disabled } = props;

  return (
    <button
      className={`w-full p-3 rounded-lg bg-blue-600 text-white ${
        disabled ? "hover:bg-blue-700" : ""
      } transition ease-in-out ${className || ""}`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
