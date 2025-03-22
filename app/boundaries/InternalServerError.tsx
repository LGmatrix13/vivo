import { Link } from "@remix-run/react";
import "@fontsource-variable/golos-text";

export default function InternalServerError() {
  return (
    <div className="h-screen w-full flex justify-center items-center flex-col space-y-3">
      <h1 className="text-3xl font-bold">Inernal Error Occurred</h1>
      <p>Something wrong happened internally.</p>
      <Link to="/auth/login">
        <button className="bg-blue-600 hover:bg-blue-700 transition ease-in-out h-10 px-3 rounded-full text-white">
          Go Home
        </button>
      </Link>
    </div>
  );
}
