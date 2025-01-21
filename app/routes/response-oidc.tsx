import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import Loading from "~/components/common/Loading";
import { IGraphUser } from "~/models/graphUser";
import { auth } from "~/utilties/auth.server";
import { msalConfig } from "~/utilties/msal";

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
    console.error("Error acquiring token:", error);
    throw json({ error: "Token acquisition failed" }, { status: 500 });
  }
}

export default function ResponseOidcPage() {
  const fetcher = useFetcher();

  useEffect(() => {
    const pca = new PublicClientApplication(msalConfig);

    async function initAndHandleRedirect() {
      try {
        await pca.initialize();
        const tokenResponse = await pca.handleRedirectPromise();
        const accounts = pca.getAllAccounts();

        if (!accounts.length && !tokenResponse) {
          console.error("No accounts available after redirect.");
          return;
        }

        // Set the active account (either from redirect response or the first account)
        const activeAccount = tokenResponse?.account || accounts[0];
        pca.setActiveAccount(activeAccount);

        // Acquire token silently
        const tokenRequest = {
          scopes: ["User.Read"],
          account: activeAccount as AccountInfo,
        };
        const silentTokenResponse = await pca.acquireTokenSilent(tokenRequest);

        // Submit token to backend
        fetcher.submit(
          {
            accessToken: silentTokenResponse.accessToken,
          },
          {
            method: "POST",
          }
        );
      } catch (error) {
        console.error("Error handling redirect or acquiring token:", error);
      }
    }

    initAndHandleRedirect();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Loading title="Authenticating..." />
    </div>
  );
}
