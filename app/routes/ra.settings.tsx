import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Settings" },
    { name: "Vivo: Settings", content: "Settings page" },
  ];
};

export default function RASettingsLayout() {
  return <p className="text-center">Not yet complete</p>;
}
