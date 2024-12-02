import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Chart, File, Home, Logo, Calendar, Users, Door } from "./Icons";

export default function AdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname;
  const routes = [
    {
      name: "Schedules",
      Icon: Calendar,
      default: "/admin/schedules/schedule",
      parent: "/admin/schedules",
    },
    {
      name: "Reports",
      Icon: File,
      default: "/admin/reports/conversation",
      parent: "/admin/reports",
    },
    {
      name: "Insights",
      Icon: Chart,
      default: "/admin/insights",
      parent: "/admin/insights",
    },
    {
      name: "RCIs",
      Icon: Door,
      default: "/admin/rcis/complete",
      parent: "/admin/rcis",
    },
    {
      name: "People",
      Icon: Users,
      default: "/admin/people/residents",
      parent: "/admin/people",
    },
    {
      name: "Housing",
      Icon: Home,
      default: "/admin/housing/buildings",
      parent: "/admin/housing",
    },
  ];

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-2xl mx-auto flex items-center px-10 justify-between">
        <Link to="/admin/schedules/schedule">
          <Logo />
        </Link>
        <div className="ml-auto order-2 flex space-x-5 text-lg">
          {routes.map((route) => (
            <Link to={route.default}>
              <button
                className={`${isActivePage(
                  route.parent
                )} py-7 flex items-center space-x-2`}
              >
                <route.Icon />
                <p className="font-bold">{route.name}</p>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
