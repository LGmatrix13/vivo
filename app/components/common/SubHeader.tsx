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
    return currentPath === path ? "bg-blue-600 text-white border cursor-default" : "border";
  }

  return (
    <div className="flex flex-row space-x-3 mb-7">
      {pages.map((page, index) => (
        <Link to={page.path} key={index} prefetch="intent">
          <button
            className={`${isActivePage(
              page.path
            )} px-3 py-1 rounded-lg hover:bg-blue-700 hover:text-white transition ease-in-out`}
          >
            {page.name}
          </button>
        </Link>
      ))}
    </div>
  );
}
