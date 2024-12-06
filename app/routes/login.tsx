import { LoginLogo, Office } from "~/components/common/Icons";
import IconButton from "~/components/common/IconButton";
import { Form, redirect } from "@remix-run/react";
import { auth } from "~/utilties/auth.server";
import "@fontsource-variable/golos-text";
import { IUser } from "~/models/user";

export async function action() {
  const user = {
    id: 1,
    name: "Tori Wright",
    email: "WrightVA@gcc.edu",
    role: "admin",
  };
  const jwt = await auth.signJWT(user as IUser);

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await auth.cookie.serialize(jwt, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      }),
    },
  });
}

export default function LoginPage() {
  return (
    <main className="flex flex-row divide-x">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="flex flex-col space-y-5">
          <LoginLogo />
          <span className="text-lg">Live, Laugh, Love</span>
        </div>
      </div>
      <div className="w-1/2 h-screen flex items-center justify-center">
        <Form method="post">
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft
          </IconButton>
        </Form>
      </div>
    </main>
  );
}
