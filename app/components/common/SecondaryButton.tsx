interface SecondaryButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
}

export default function SecondaryButton(props: SecondaryButtonProps) {
  const { onClick, children, options, className } = props;

  return (
    <button
      className={`w-fit py-2 px-3 rounded-lg border text-black hover:bg-gray-50 transition ease-in-out ${
        className || ""
      }`}
      onClick={onClick}
      {...options}
    >
      {children}
    </button>
  );
}
