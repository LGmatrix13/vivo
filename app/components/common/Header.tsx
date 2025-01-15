import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Logo } from "./Icons";
import { IUser } from "~/models/user";

interface HeaderProps {
  root: string;
  routes: {
    name: string;
    Icon: (props: any) => React.ReactElement;
    default: string;
    parent: string;
  }[];
  settings: {
    user: IUser;
    path: string;
  };
}

export default function Header(props: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { routes, root, settings } = props;

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-2xl mx-auto md:flex md:items-center md:px-10 md:justify-between">
        <Link to={root}>
          <div className="md:p-0 px-10 pt-5">
            <Logo />
          </div>
        </Link>
        <div className="space-x-7 flex items-center overflow-x-auto md:px-0 px-10">
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
            <Link to={settings.path}>
              <button
                className={`${isActivePage(
                  settings.path
                )} md:py-7 py-5 flex items-center space-x-2`}
              >
                <img
                  src={settings.user.avatar}
                  alt={`${settings.user.firstName}'s Profile Picture`}
                  className={`w-5 h-5 rounded-full`}
                />
                <span className="font-bold">{settings.user.firstName}</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
