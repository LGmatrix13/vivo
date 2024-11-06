import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo" },
    { name: "Vivo", content: "Residence Life, Centralized" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col text-center space-y-3">
        <h1 className="font-bold text-2xl">Vivo</h1>
        <p>Live, Laugh, Love</p>
      </div>
    </div>
  );
}