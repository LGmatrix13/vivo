interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
}

export default function Button(props: ButtonProps) {
  const { onClick, children, options, className } = props;

  return (
    <button
      className={`w-fit py-2 px-3 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white transition ease-in-out ${
        className || ""
      }`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
