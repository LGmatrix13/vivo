import { Link } from "@remix-run/react";
import "@fontsource-variable/golos-text";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col space-y-3">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/auth/login">
        <button className="bg-blue-600 hover:bg-blue-700 transition ease-in-out h-12 px-3 rounded-lg text-white">
          Go Home
        </button>
      </Link>
    </div>
  );
}
