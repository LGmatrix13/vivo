import Button from "./Button";
import SecondaryButton from "./SecondaryButton";

interface IconButtonProps {
  Icon: (props: any) => React.ReactElement;
  onClick?: () => void;
  children: React.ReactNode;
  options?: {
    [key: string]: string;
  };
  secondary?: boolean;
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, children, onClick, options, secondary } = props;
  const Component = secondary ? SecondaryButton : Button;

  return (
    <Component
      className="flex items-center space-x-2"
      onClick={onClick}
      options={options}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Component>
  );
}
