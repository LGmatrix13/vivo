import { ReactNode } from "react";

interface IIndicationProps {
  level: "danger" | "warning" | "success";
  title: string;
  message: string;
  Icon: (props: any) => ReactNode;
}

export default function Indication(props: IIndicationProps) {
  const { level, message, title, Icon } = props;

  const backgroundColor =
    level === "warning"
      ? "bg-orange-600"
      : level === "danger"
      ? "bg-red-600"
      : "bg-green-600";
  return (
    <div className="flex space-x-3 items-start">
      <div
        className={`w-10 h-10 justify-center items-center flex rounded-full ${backgroundColor}`}
      >
        <Icon className="text-white" />
      </div>
      <div className="space-y-3">
        <h2 className="font-bold">{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
