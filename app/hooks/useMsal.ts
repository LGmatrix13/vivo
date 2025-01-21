import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { useFetcher, useNavigate } from "@remix-run/react";
import { msalConfig } from "~/utilties/msal";

export default function useMsal() {
  const pca = new PublicClientApplication(msalConfig);
  const navigate = useNavigate();
  const fetcher = useFetcher();

  async function initialize() {
    return pca.initialize().then(() => {
      pca.handleRedirectPromise().catch((error) => {
        console.error("Error handling redirect:", error);
      });
    });
  }

  function handleLogin() {
    initialize().then(() => {
      try {
        const accounts = pca.getAllAccounts();

        if (accounts.length > 0) {
          navigate("/response-oidc");
        }

        pca.loginRedirect({
          scopes: ["User.Read"],
          redirectUri: "http://localhost:5173/response-oidc",
        });
      } catch (error) {
        console.error("Login error:", error);
      }
    });
  }

  function handleAccessToken() {
    initialize().then(() => {
      const accounts = pca.getAllAccounts();

      if (!accounts.length) {
        console.error("No accounts available after redirect.");
        navigate("/auth/login");
      }

      const activeAccount = accounts[0];
      pca.setActiveAccount(activeAccount);

      const tokenRequest = {
        scopes: ["User.Read"],
        account: activeAccount as AccountInfo,
      };
      pca.acquireTokenSilent(tokenRequest).then((response) => {
        fetcher.submit(
          {
            accessToken: response.accessToken,
          },
          {
            method: "POST",
          }
        );
      });
    });
  }

  function handleLogout() {
    pca.initialize().then(() => {
      pca.logoutRedirect();
    });
  }

  return {
    handleLogin,
    handleAccessToken,
    handleLogout,
  };
}
