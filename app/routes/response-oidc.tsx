import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import Loading from "~/components/common/Loading";
import useMsal from "~/hooks/useMsal";
import { IGraphUser } from "~/models/graphUser";
import { auth } from "~/utilties/auth.server";
import { db } from "~/utilties/connection.server";
import {
  adminTable,
  residentTable,
  staffTable,
  zoneTable,
} from "~/utilties/schema.server";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;

  try {
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!graphResponse.ok) {
      throw new Error("Failed to fetch user profile.");
    }

    const userInfo = (await graphResponse.json()) as IGraphUser;

    async function redirectWithJwt(jwt: string) {
      return redirect("/staff/reports/conversation", {
        headers: {
          "Set-Cookie": await auth.jwtCookie.serialize(jwt, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
          }),
        },
      });
    }
    const email = userInfo.mail;
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
      .where(eq(residentTable.emailAddress, email))
      .limit(1);

    if (residents.length) {
      const user = residents[0];
      const jwt = await auth.signJwt({
        ...partialPayload,
        id: user.id,
        role: "resident",
      });
      return redirectWithJwt(jwt);
    }

    const zones = await db.client
      .select({
        id: zoneTable.id,
      })
      .from(zoneTable)
      .innerJoin(residentTable, eq(zoneTable.residentId, residentTable.id))
      .where(eq(residentTable.emailAddress, email))
      .limit(1);

    if (zones.length) {
      const user = zones[0];
      const jwt = await auth.signJwt({
        ...partialPayload,
        id: user.id,
        role: "ra",
      });
      return redirectWithJwt(jwt);
    }

    const staff = await db.client
      .select({
        id: staffTable.id,
      })
      .from(staffTable)
      .where(eq(staffTable.emailAddress, email))
      .limit(1);

    if (staff.length) {
      const user = staff[0];
      const jwt = await auth.signJwt({
        ...partialPayload,
        id: user.id,
        role: "rd",
      });
      return redirectWithJwt(jwt);
    }

    const admin = await db.client
      .select()
      .from(adminTable)
      .where(eq(adminTable.emailAddress, email))
      .limit(1);

    if (admin.length) {
      const user = admin[0];
      const jwt = await auth.signJwt({
        ...partialPayload,
        id: user.id,
        role: "rd",
      });
      return redirectWithJwt(jwt);
    }

    throw json({ error: "Token acquisition failed" }, { status: 500 });
  } catch (error) {
    throw json({ error: "Token acquisition failed" }, { status: 500 });
  }
}

export default function ResponseOidcPage() {
  const { handleAccessToken } = useMsal();

  useEffect(() => {
    handleAccessToken();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loading title="Authenticating..." />
    </div>
  );
}
