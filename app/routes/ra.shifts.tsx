import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Shifts" },
    { name: "Vivo: Shifts", content: "Duty shifts for your buidling" },
  ];
};
export default function RAShiftsLayout() {
  return <p className="text-center">Not yet complete</p>;
}
