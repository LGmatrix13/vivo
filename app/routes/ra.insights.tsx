import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Insights" },
    { name: "Vivo: Insights", content: "Insights on your hall" },
  ];
};

export default function RAInsightsPage() {
  return <p className="text-center">Not yet completed</p>;
}


