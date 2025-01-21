import { PublicClientApplication } from "@azure/msal-browser";
import { useFetcher } from "@remix-run/react";
import { msalConfig } from "~/utilties/msal";

export default function useMsal() {
  const fetcher = useFetcher();

  async function handleLogin() {
    const pca = await PublicClientApplication.createPublicClientApplication(
      msalConfig
    );
    pca.loginRedirect({
      scopes: ["User.Read"],
      redirectUri: "http://localhost:5173/response-oidc",
    });
  }

  async function handleAccessToken() {
    const pca = await PublicClientApplication.createPublicClientApplication(
      msalConfig
    );
    const account = pca.getAllAccounts()[0];

    const tokenRequest = {
      scopes: ["User.Read"],
      account: account,
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
