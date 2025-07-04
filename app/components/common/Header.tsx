import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Logo } from "./Icons";

interface HeaderProps {
  root: string;
  routes: {
    name: string;
    Icon: (props: any) => React.ReactElement;
    default: string;
    parent: string;
  }[];
}

/**
 * generic header component for navigation
 */
export default function Header(props: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { routes, root } = props;

  return (
    <header className="border-b border-gray-300 mb-7">
      <nav className="max-w-screen-2xl mx-auto md:flex md:items-center md:px-10 md:justify-between">
        <Link to={root} data-discover="true" title={routes[0].name}>
          <div className="md:p-0 px-7 pt-5">
            <Logo />
          </div>
        </Link>
        <div className="space-x-7 flex items-center overflow-x-auto md:px-0 px-7">
          <div className="flex space-x-5 md:text-lg">
            {routes.map((route, index) => {
              const active = currentPath.startsWith(route.parent);

              return (
                <Link
                  to={route.default}
                  key={index}
                  data-discover="true"
                  title={route.name}
                >
                  <button
                    className={`${
                      active ? "border-b-2 border-blue-600" : ""
                    } md:py-7 py-5 flex items-center space-x-2`}
                  >
                    <route.Icon />
                    {active ? (
                      <h1 className="font-bold">{route.name}</h1>
                    ) : (
                      <span className="font-bold">{route.name}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
