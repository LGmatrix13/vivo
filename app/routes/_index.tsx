import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo" },
    { name: "Vivo", content: "Residence Life, Centralized" },
  ];
};

export async function loader() {
  return redirect("/staff/shifts/on-duty");
}
