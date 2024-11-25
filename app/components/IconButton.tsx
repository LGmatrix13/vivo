import Button from "./Button";

interface IconButtonProps {
  Icon: (props: any) => React.ReactElement;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, children, onClick } = props;

  return (
    <Button className="flex items-center space-x-2" onClick={onClick}>
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Button>
  );
}
