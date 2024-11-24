import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Chart, File, Pencil, Home, Logo, Calendar, Users } from "./Icons";

const paths = {
  SCHEDULES: "/admin/schedules",
  REPORTS: "/admin/reports",
  INSIGHTS: "/admin/insights",
  RCIS: "/admin/rcis",
  PEOPLE: "/admin/people",
  HOUSING: "/admin/housing/buildings",
};

export default function AdminHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-xl mx-auto flex items-center px-7 justify-between">
        <Link to={paths.SCHEDULES}>
          <Logo className="fill-black" />
        </Link>
        <div className="ml-auto order-2 flex space-x-5 text-lg">
          <Link to={paths.SCHEDULES}>
            <button
              className={`${isActivePage(
                paths.SCHEDULES
              )} py-7 flex items-center space-x-2`}
            >
              <Calendar />
              <p className="font-bold">Schedules</p>
            </button>
          </Link>
          <Link to={paths.REPORTS}>
            <button
              className={`${isActivePage(
                paths.REPORTS
              )} py-7 flex items-center space-x-2`}
            >
              <File />
              <p className="font-bold">Reports</p>
            </button>
          </Link>
          <Link to={paths.INSIGHTS}>
            <button
              className={`${isActivePage(
                paths.INSIGHTS
              )} py-7 flex items-center space-x-2`}
            >
              <Chart />
              <p className="font-bold">Insights</p>
            </button>
          </Link>
          <Link to={paths.RCIS}>
            <button
              className={`${isActivePage(
                paths.RCIS
              )} py-7 flex items-center space-x-2`}
            >
              <Pencil />
              <p className="font-bold">RCIs</p>
            </button>
          </Link>
          <Link to={paths.PEOPLE}>
            <button
              className={`${isActivePage(
                paths.PEOPLE
              )} py-7 flex items-center space-x-2`}
            >
              <Users />
              <p className="font-bold">People</p>
            </button>
          </Link>
          <Link to={paths.HOUSING}>
            <button
              className={`${isActivePage(
                paths.HOUSING
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
