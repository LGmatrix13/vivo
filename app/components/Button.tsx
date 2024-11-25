interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const { onClick, children } = props;

  return (
    <button
      className={`w-fit py-2 px-3 rounded-lg bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition ease-in-out ${
        props.className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
