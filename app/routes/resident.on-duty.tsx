import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: On Duty" },
    { name: "Vivo: On Duty", content: "RAs on duty" },
  ];
};


export default function ResidentOnDutyPage() {
  return <p>Not completed</p>;
}
