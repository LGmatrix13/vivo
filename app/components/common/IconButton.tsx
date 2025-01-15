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
      className={`flex items-center space-x-2 ${className || ""}`}
      onClick={onClick}
      options={options}
  
    >
      <Icon />
      <span>{children}</span>
    </Button>
  );
}
