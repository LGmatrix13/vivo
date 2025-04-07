interface WideButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  options?: {
    [key: string]: any;
  };
}

/**
 * generic wide button for forms and opening drawers
 */
export default function WideButton(props: WideButtonProps) {
  const { onClick, children, options, className, disabled } = props;

  return (
    <button
      className={`w-full px-3 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ease-in-out ${
        className || ""
      }`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
