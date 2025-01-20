import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { Outlet } from "@remix-run/react";
import { msalConfig } from "~/utilties/msal";

export default function AuthLayout() {
  const pca = new PublicClientApplication(msalConfig);
  return (
    <MsalProvider instance={pca}>
      <Outlet />
    </MsalProvider>
  );
}
