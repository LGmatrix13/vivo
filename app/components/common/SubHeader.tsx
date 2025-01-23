import { Link, useLocation } from "@remix-run/react";

interface SubHeaderProps {
  pages: {
    name: string;
    path: string;
  }[];
}

export default function SubHeader(props: SubHeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { pages } = props;

  function isActivePage(path: string) {
    return currentPath === path ? "bg-gray-50 border cursor-default" : "border";
  }

  return (
    <div className="flex w-full flex-row space-x-3 mb-5 overflow-y-auto px-7">
      {pages.map((page, index) => (
        <Link to={page.path} key={index}>
          <button
            className={`${isActivePage(
              page.path
            )} h-9 px-3 rounded-lg w-fit hover:bg-gray-50 transition ease-in-out`}
          >
            {page.name}
          </button>
        </Link>
      ))}
    </div>
  );
}
