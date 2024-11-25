import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";

const paths = {
  ON_DUTY: "/on-duty",
  REPORTS: "/reports",
  ANALYTICS: "/analytics",
  RCIS: "/rcis",
  LINKS: "/links",
};

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  function isActivePage(path: string) {
    return currentPath.startsWith(path) ? "border-b-2 border-blue-600" : "";
  }

  return (
    <header className="border-b mb-7">
      <nav className="max-w-screen-xl mx-auto flex items-center px-7 justify-between">
        <Link to={paths.ON_DUTY}>
          <h1 className="text-3xl font-extrabold">
            v<span className="text-blue-600">i</span>vo
          </h1>
        </Link>
        <div className="ml-auto order-2 flex space-x-5 text-lg">
          <Link to={paths.ON_DUTY}>
            <button
              className={`${isActivePage(
                paths.ON_DUTY
              )} py-7 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              <p className="font-bold">On Duty</p>
            </button>
          </Link>
          <Link to={paths.REPORTS}>
            <button
              className={`${isActivePage(
                paths.REPORTS
              )} py-7 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-file"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              </svg>
              <p className="font-bold">Reports</p>
            </button>
          </Link>
          <Link to={paths.ANALYTICS}>
            <button
              className={`${isActivePage(
                paths.ANALYTICS
              )} py-7 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-antenna-bars-5"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 18l0 -3" />
                <path d="M10 18l0 -6" />
                <path d="M14 18l0 -9" />
                <path d="M18 18l0 -12" />
              </svg>
              <p className="font-bold">Analytics</p>
            </button>
          </Link>
          <Link to={paths.RCIS}>
            <button
              className={`${isActivePage(
                paths.RCIS
              )} py-7 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-pencil"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                <path d="M13.5 6.5l4 4" />
              </svg>
              <p className="font-bold">RCIs</p>
            </button>
          </Link>
          <Link to={paths.LINKS}>
            <button
              className={`${isActivePage(
                paths.LINKS
              )} py-7 flex items-center space-x-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-link"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 15l6 -6" />
                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
              </svg>
              <p className="font-bold">Links</p>
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
