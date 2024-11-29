import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Chart, File, Home, Logo, Calendar, Users, Door } from "./Icons";

const paths = {
  schedules: {
    default: "/admin/schedules/schedule",
    parent: "/admin/schedules",
  },
  reports: {
    default: "/admin/reports/conversation",
    parent: "/admin/reports",
  },
  insights: "/admin/insights",
  rcis: {
    default: "/admin/rcis/complete",
    parent: "/admin/rcis",
  },
  people: {
    default: "/admin/people/residents",
    parent: "/admin/people",
  },
  housing: {
    default: "/admin/housing/buildings",
    parent: "/admin/housing",
  },
};

export default function AdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-2xl mx-auto flex items-center px-10 justify-between">
        <Link to={paths.schedules.default}>
          <Logo />
        </Link>
        <div className="ml-auto order-2 flex space-x-5 text-lg">
          <Link to={paths.schedules.default}>
            <button
              className={`${isActivePage(
                paths.schedules.parent
              )} py-7 flex items-center space-x-2`}
            >
              <Calendar />
              <p className="font-bold">Schedules</p>
            </button>
          </Link>
          <Link to={paths.reports.default}>
            <button
              className={`${isActivePage(
                paths.reports.parent
              )} py-7 flex items-center space-x-2`}
            >
              <File />
              <p className="font-bold">Reports</p>
            </button>
          </Link>
          <Link to={paths.insights}>
            <button
              className={`${isActivePage(
                paths.insights
              )} py-7 flex items-center space-x-2`}
            >
              <Chart />
              <p className="font-bold">Insights</p>
            </button>
          </Link>
          <Link to={paths.rcis.default}>
            <button
              className={`${isActivePage(
                paths.rcis.parent
              )} py-7 flex items-center space-x-2`}
            >
              <Door />
              <p className="font-bold">RCIs</p>
            </button>
          </Link>
          <Link to={paths.people.default}>
            <button
              className={`${isActivePage(
                paths.people.parent
              )} py-7 flex items-center space-x-2`}
            >
              <Users />
              <p className="font-bold">People</p>
            </button>
          </Link>
          <Link to={paths.housing.default}>
            <button
              className={`${isActivePage(
                paths.housing.parent
              )} py-7 flex items-center space-x-2`}
            >
              <Home />
              <p className="font-bold">Housing</p>
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
