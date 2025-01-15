import { LoginLogo, Office } from "~/components/common/Icons";
import IconButton from "~/components/common/IconButton";
import { Form } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
// import { msal } from "~/utilties/msal.server";
import { auth } from "~/utilties/auth.server";
import { Role } from "~/models/role";

export async function loader({ request }: ActionFunctionArgs) {
  await auth.rejectAuthorized(request);
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  // USE BELOW FOR MS-AUTH
  // const redirectUri = `${new URL(request.url).origin}/auth/callback`;
  // const authUrlRequest = {
  //   scopes: ["user.read"],
  //   redirectUri,
  // };
  // try {
  //   const authCodeUrl = await msal.getAuthCodeUrl(authUrlRequest);
  //   return redirect(authCodeUrl);
  // } catch (error) {
  //   console.error(error);
  //   throw json({ error: "Authentication failed" }, { status: 500 });
  // }
  const formData = await request.formData();
  const { intent, ...values } = Object.fromEntries(formData);
  const role = values["role"] as Role;

  const id = {
    admin: 1,
    resident: 4,
    ard: 1,
    rd: 2,
    ra: 3,
  };

  const user = {
    id: id[role],
    firstName: "Ethan",
    lastName: "Kesterholt",
    role: role,
    email: "kesterholter21@gcc.edu",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQFBb5N0Hlk4QA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686060645931?e=1741219200&v=beta&t=QVHwVCYIQSJowagCjG53uRAIg72CoDM7HdIxDni6o8E",
  };

  return auth.login(user);
}

export default function LoginPage() {
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
        <Form method="post">
          <input type="hidden" value="admin" name="role" />
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft - Admin
          </IconButton>
        </Form>
        <Form method="post">
          <input type="hidden" value="ra" name="role" />
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft - RA
          </IconButton>
        </Form>
        <Form method="post">
          <input type="hidden" value="rd" name="role" />
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft - RD
          </IconButton>
        </Form>
        <Form method="post">
          <input type="hidden" value="resident" name="role" />
          <IconButton
            Icon={Office}
            options={{
              type: "submit",
            }}
          >
            Login with Microsoft - Resident
          </IconButton>
        </Form>
      </div>
    </main>
  );
}
