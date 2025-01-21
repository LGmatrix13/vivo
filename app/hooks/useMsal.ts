import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { useFetcher, useNavigate } from "@remix-run/react";
import { msalConfig } from "~/utilties/msal";

export default function useMsal() {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  async function handleLogin() {
    const pca = await PublicClientApplication.createPublicClientApplication(
      msalConfig
    );
    await pca.handleRedirectPromise();
    pca.loginRedirect({
      scopes: ["User.Read"],
      redirectUri: "http://localhost:5173/response-oidc",
    });
  }

  async function handleAccessToken() {
    const pca = await PublicClientApplication.createPublicClientApplication(
      msalConfig
    );
    const accounts = pca.getAllAccounts();

    if (!accounts.length) {
      navigate("/auth/login");
    }

    const activeAccount = accounts[0];

    const tokenRequest = {
      scopes: ["User.Read"],
      account: activeAccount as AccountInfo,
    };

    const response = await pca.acquireTokenSilent(tokenRequest);
    fetcher.submit(
      {
        accessToken: response.accessToken,
      },
      {
        method: "POST",
      }
    );
  }

  return {
    handleLogin,
    handleAccessToken,
  };
}
