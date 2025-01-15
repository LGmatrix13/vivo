import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { IGraphUser } from "~/models/graphUser";
import { auth } from "~/utilties/auth.server";
import { msal } from "~/utilties/msal.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return json({ error: "Missing authorization code" }, { status: 400 });
  }

  try {
    const tokenRequest = {
      code,
      scopes: ["user.read"],
      redirectUri: `${url.origin}/auth/callback`,
    };

    const tokenResponse = await msal.acquireTokenByCode(tokenRequest);
    if (!tokenResponse.accessToken) {
      throw new Error("Failed to acquire access token.");
    }

    // Fetch user information from Microsoft Graph API
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
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

    return redirect("/admin", {
      headers: {
        "Set-Cookie": await auth.jwtCookie.serialize(jwt, {
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        }),
      },
    });
  } catch (error) {
    console.error("Error acquiring token:", error);
    throw json({ error: "Token acquisition failed" }, { status: 500 });
  }
}
