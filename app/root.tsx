import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import "@fontsource-variable/golos-text";
import "./tailwind.css";
import NotFound from "./boundaries/NotFound";
import InternalServerError from "./boundaries/InternalServerError";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <>
      {isRouteErrorResponse(error) && error.status == 404 && <NotFound />}
      {isRouteErrorResponse(error) && error.status == 500 && (
        <InternalServerError />
      )}
    </>
  );
}

export default function App() {
  return <Outlet />;
}
