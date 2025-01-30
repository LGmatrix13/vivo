import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Insights" },
    { name: "Vivo: Insights", content: "Insights page" },
  ];
};

export default function AdminInsightsPage() {
  return <p className="text-center">Insights page is not complete</p>;
}
