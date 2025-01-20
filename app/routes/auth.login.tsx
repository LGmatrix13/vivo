import { LoginLogo, Office } from "~/components/common/Icons";
import IconButton from "~/components/common/IconButton";
import { Form, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { msal } from "~/utilties/msal";

export async function loader({ request }: ActionFunctionArgs) {
  await auth.rejectAuthorized(request);
  const url = await msal.getAuthCodeUrl({
    redirectUri: "http://vivo.gcc.edu/response-oidc",
  });

  return {
    url,
  };
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="flex flex-row divide-x">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="flex flex-col space-y-5 w-96">
          <LoginLogo />
          <div className="space-y-3 flex flex-col">
            <span className="text-lg">
              "How very good and pleasant it is when kindred live together in
              unity"
            </span>
            <span>Psalms 133:1</span>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen flex flex-col items-center justify-center space-y-5">
        <a href={data.url}>
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft
          </IconButton>
        </a>
      </div>
    </main>
  );
}
