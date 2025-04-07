interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
}

/**
 * generic button for forms and opening drawers
 */
export default function Button(props: ButtonProps) {
  const { onClick, children, options, className } = props;

  return (
    <button
      className={`w-fit h-12 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ease-in-out ${
        className || ""
      }`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
