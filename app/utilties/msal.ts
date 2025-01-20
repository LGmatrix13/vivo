import { PublicClientApplication } from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID!}`,
    redirectUrl: "http://vivo.gcc.edu/response-oidc",
  },
};

export const msal = new PublicClientApplication(msalConfig);
