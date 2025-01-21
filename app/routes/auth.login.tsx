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

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;

  const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!graphResponse.ok) {
    throw new Error("Failed to fetch user profile.");
  }

  const userInfo = (await graphResponse.json()) as IGraphUser;

  async function redirectWithJwt(jwt: string, role: Role) {
    return redirect(`/${role}`, {
      headers: {
        "Set-Cookie": await auth.jwtCookie.serialize(jwt, {
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        }),
      },
    });
  }
  const email = userInfo.mail.toUpperCase();
  const partialPayload = {
    firstName: userInfo.givenName,
    lastName: userInfo.surname,
    email: userInfo.mail,
  };

  const residents = await db.client
    .select({
      id: residentTable.id,
    })
    .from(residentTable)
    .where(like(residentTable.emailAddress, email))
    .limit(1);

  console.log(residents);

  if (residents.length) {
    const user = residents[0];
    const jwt = await auth.signJwt({
      ...partialPayload,
      id: user.id,
      role: "resident",
    });
    return await redirectWithJwt(jwt, "resident");
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
    const jwt = await auth.signJwt({
      ...partialPayload,
      id: user.id,
      role: "ra",
    });
    return await redirectWithJwt(jwt, "ra");
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
    const jwt = await auth.signJwt({
      ...partialPayload,
      id: user.id,
      role: "rd",
    });
    return await redirectWithJwt(jwt, "rd");
  }

  const admin = await db.client
    .select()
    .from(adminTable)
    .where(like(adminTable.emailAddress, email))
    .limit(1);

  if (admin.length) {
    const user = admin[0];
    const jwt = await auth.signJwt({
      ...partialPayload,
      id: user.id,
      role: "admin",
    });
    return await redirectWithJwt(jwt, "admin");
  }

  return redirect("/auth/login");
}

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.rejectAuthorized(request);
  return null;
}

export default function LoginPage() {
  const { handleLogin } = useMsal();

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
