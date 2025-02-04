import { redirect, type MetaFunction } from "@remix-run/node";
import { Logo } from "~/components/common/Icons";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo" },
    { name: "Vivo", content: "Residence Life, Centralized" },
  ];
};

export default function Index() {
  return (
    <>
      <div className="flex items-center justify-between border-b px-10 py-7">
        <Logo />
        <div>Login</div>
      </div>
      <main className="max-w-screen-2xl mx-auto md:px-10 px-7 mb-7">
        <div className="text-center space-y-3 my-40">
          <h1 className="text-4xl font-bold">
            Orangize effortless,
            <br />
            understand more
          </h1>
          <p className="text-lg">
            Reporting, management, and insights for your residence life
            community in one place.
          </p>
        </div>
        <div className="border rounded-lg divide-y">
          <div className="divide-x rounded-lg flex h-72">
            <div className="space-y-2 w-96 p-7">
              <h2 className="font-bold text-xl">Reporting made easy</h2>
              <p>Paper no more</p>
            </div>
            <div className="p-7">reportings</div>
          </div>
          <div className="divide-x flex h-72">
            <div className="space-y-2 w-96 p-7">
              <h2 className="font-bold text-xl">Reporting made easy</h2>
              <p>Paper no more</p>
            </div>
            <div className="p-7">reportings</div>
          </div>
        </div>
      </main>
    </>
  );
}
