import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: RCIs" },
    { name: "Vivo: RCIs", content: "RCIs for your hall" },
  ];
};

export async function loader() {
  return redirect("/ra/rcis/complete");
}
