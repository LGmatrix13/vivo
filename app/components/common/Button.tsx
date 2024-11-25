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
      className={`w-fit py-2 px-3 rounded-lg bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition ease-in-out ${
        className || ""
      }`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
