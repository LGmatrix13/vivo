import { InputSearch } from "./Icons";

interface InstructionProps {
  title: string;
  Icon?: (props: any) => React.ReactNode;
}

/**
 * instructions to be used inside of a table to intruct the user to open a record
 */
export default function Instruction(props: InstructionProps) {
  const { title, Icon = InputSearch } = props;

  return (
    <div className="hidden md:flex w-2/5 p-5 space-y-3 flex-col items-center justify-center">
      <Icon className="w-7 h-7" />
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
