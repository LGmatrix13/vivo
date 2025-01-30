import Loading from "~/components/common/Loading";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Authenticating" },
    { name: "Vivo: Authenticating", content: "Authenticating" },
  ];
};

export default function ResponseOidc() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loading title="Authenticating..." />
    </div>
  );
}
