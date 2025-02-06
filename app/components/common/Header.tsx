import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Logo, UserCircle } from "./Icons";
import { IUser } from "~/models/user";

interface HeaderProps {
  root: string;
  routes: {
    name: string;
    Icon: (props: any) => React.ReactElement;
    default: string;
    parent: string;
  }[];
}

export default function Header(props: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { routes, root } = props;

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-2xl mx-auto md:flex md:items-center md:px-10 md:justify-between">
        <Link to={root}>
          <div className="md:p-0 px-7 pt-5">
            <Logo />
          </div>
        </Link>
        <div className="space-x-7 flex items-center overflow-x-auto md:px-0 px-7">
          <div className="flex space-x-5 md:text-lg">
            {routes.map((route, index) => (
              <Link to={route.default} key={index}>
                <button
                  className={`${isActivePage(
                    route.parent
                  )} md:py-7 py-5 flex items-center space-x-2`}
                >
                  <route.Icon />
                  <p className="font-bold">{route.name}</p>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
