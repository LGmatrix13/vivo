import { LoginLogo, Office } from "~/components/common/Icons";
import IconButton from "~/components/common/IconButton";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import useMsal from "~/hooks/useMsal";
import { auth } from "~/utilties/auth.server";
import { like, eq } from "drizzle-orm";
import { IGraphUser } from "~/models/graphUser";
import { Role } from "~/models/role";
import { db } from "~/utilties/connection.server";
import {
  residentTable,
  zoneTable,
  staffTable,
  adminTable,
} from "~/utilties/schema.server";
import { Form } from "@remix-run/react";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const { role, ...values } = Object.fromEntries(formData);
  if (role) {
    const id = {
      admin: 1,
      resident: 4,
      ard: 1,
      rd: 2,
      ra: 3,
    };

    const user = {
      id: id[role as Role],
      firstName: "Ethan",
      lastName: "Kesterholt",
      role: role as Role,
      email: "kesterholter21@gcc.edu",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4D03AQFBb5N0Hlk4QA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1686060645931?e=1741219200&v=beta&t=QVHwVCYIQSJowagCjG53uRAIg72CoDM7HdIxDni6o8E",
    };

    return auth.login(user);
  }

  const accessToken = values["accessToken"];

  const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!graphResponse.ok) {
    throw new Error("Failed to fetch user profile.");
  }

  const userInfo = (await graphResponse.json()) as IGraphUser;

  const email = userInfo.mail.toUpperCase();
  const partialPayload = {
    firstName: userInfo.givenName,
    lastName: userInfo.surname,
    email: userInfo.mail,
  };

  const admin = await db.client
  .select()
  .from(adminTable)
  .where(like(adminTable.emailAddress, email))
  .limit(1);

  if (admin.length) {
    const user = admin[0];
    return auth.login({
      ...partialPayload,
      id: user.id,
      role: "admin",
    });
  }

  const staff = await db.client
  .select({
    id: staffTable.id,
  })
  .from(staffTable)
  .where(like(staffTable.emailAddress, email))
  .limit(1);

  if (staff.length) {
    const user = staff[0];
    return auth.login({
      ...partialPayload,
      id: user.id,
      role: "rd",
    });
  }

  const zones = await db.client
    .select({
      id: zoneTable.id,
    })
    .from(zoneTable)
    .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
    .where(like(residentTable.emailAddress, email))
    .limit(1);

  if (zones.length) {
    const user = zones[0];
    return auth.login({
      ...partialPayload,
      id: user.id,
      role: "ra",
    });
  }

  const residents = await db.client
    .select({
      id: residentTable.id,
    })
    .from(residentTable)
    .where(like(residentTable.emailAddress, email))
    .limit(1);

  if (residents.length) {
    const user = residents[0];
    return auth.login({
      ...partialPayload,
      id: user.id,
      role: "resident",
    });
  }

  return redirect("/auth/login");
}

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.rejectAuthorized(request);
  return null;
}

export default function AuthLoginPage() {
  const { handleLogin } = useMsal();

  return (
    <main className="flex flex-row">
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src={"/GCC_background.png"}
          className="w-full h-full object-cover opacity-20 saturate-50 blur-sm"
          alt="Background"
        />
      </div>
      <div className="flex items-center justify-center w-3/4 h-screen">
        <div className="relative z-10 flex flex-col space-y-5 w-96">
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
      <div className="z-10 bg-white relative w-1/4 h-screen flex flex-col items-center justify-center space-y-5">
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
        <IconButton
          onClick={() => handleLogin()}
          Icon={Office}
          options={{
            type: "submit",
          }}
        >
          Login with Microsoft
        </IconButton>
      </div>
    </main>
  );
}
