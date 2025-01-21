import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useEffect } from "react";
import Loading from "~/components/common/Loading";
import useMsal from "~/hooks/useMsal";
import { IGraphUser } from "~/models/graphUser";
import { auth } from "~/utilties/auth.server";

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;

  try {
    // Fetch user information from Microsoft Graph API
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!graphResponse.ok) {
      throw new Error("Failed to fetch user profile.");
    }

    const userInfo = (await graphResponse.json()) as IGraphUser;

    // TODO: get avatar, upsert in database, decide correct role, and redirect to correct role
    const jwt = await auth.signJwt({
      id: 1,
      firstName: userInfo.givenName,
      lastName: userInfo.surname,
      email: userInfo.mail,
      role: "admin",
      avatar: "",
    });

    return redirect("/staff/reports/conversation", {
      headers: {
        "Set-Cookie": await auth.jwtCookie.serialize(jwt, {
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        }),
      },
    });
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
