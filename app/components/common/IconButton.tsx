import Button from "./Button";

interface IconButtonProps {
  Icon: (props: any) => React.ReactElement;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, children, onClick, options, className } = props;

  return (
    <Button
      className={`flex justify-center items-center m-0 ${className || ""}`}
      onClick={onClick}
      options={options}
    >
      <div className="space-x-2 flex items-center">
        <Icon />
        <span>{children}</span>
      </div>
    </Button>
  );
}
