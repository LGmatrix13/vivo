import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import { Chart, File, Pencil, User, Home, Logo } from "./Icons";

const paths = {
  ON_DUTY: "/admin/on-duty",
  REPORTS: "/admin/reports",
  ANALYTICS: "/admin/analytics",
  RCIS: "/admin/rcis",
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
        <Link to={paths.ON_DUTY}>
          <Logo className="fill-black" />
        </Link>
        <div className="ml-auto order-2 flex space-x-5 text-lg">
          <Link to={paths.ON_DUTY}>
            <button
              className={`${isActivePage(
                paths.ON_DUTY
              )} py-7 flex items-center space-x-2`}
            >
              <User />
              <p className="font-bold">On Duty</p>
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
          <Link to={paths.ANALYTICS}>
            <button
              className={`${isActivePage(
                paths.ANALYTICS
              )} py-7 flex items-center space-x-2`}
            >
              <Chart />
              <p className="font-bold">Analytics</p>
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
