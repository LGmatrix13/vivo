import type { MetaFunction } from "@remix-run/node";
import logo from "../images/logo-white.png"

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
        <div className="justify-center flex">
          <a href="https://www.gcc.edu/Home/Staff-Directory/Staff-Detail/christopher-merrick" target="_blank">
            <img className="object-contain h-40" src={logo} />
          </a>
        </div>
        
        <p>Live, Laugh, Love</p>
      </div>
    </div>
  );
}