import { PublicClientApplication } from "@azure/msal-browser";
import { useFetcher } from "@remix-run/react";
import { msalConfig } from "~/utilties/msal";

export default function useMsal() {
  const fetcher = useFetcher();

  async function handleLogin() {
    const pca = await PublicClientApplication.createPublicClientApplication(
      msalConfig
    );
    await pca.handleRedirectPromise();
    const result = await pca.loginPopup({
      scopes: ["User.Read"],
      redirectUri: "http://localhost:5173/response-oidc",
    });
    await pca.clearCache();
    fetcher.submit(
      {
        accessToken: result.accessToken,
      },
      {
        method: "POST",
      }
    );
  }

  return {
    handleLogin,
  };
}
