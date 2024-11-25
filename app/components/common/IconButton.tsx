import Button from "./Button";

interface IconButtonProps {
  Icon: (props: any) => React.ReactElement;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, children, onClick, options } = props;

  return (
    <Button
      className="flex items-center space-x-2"
      onClick={onClick}
      options={options}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Button>
  );
}
