/**
 * config use for ms oauth
 */
export const msalConfig = {
  auth: {
    clientId: "0330f383-e27e-46c7-8146-8c54963af0cd",
    authority: `https://login.microsoftonline.com/83918960-2218-4cd3-81fe-302a8e771da9/`,
  },
  cache: {
    cacheLocation: "sessionStorage",
    temporaryCacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
    secureCookies: false,
    claimsBasedCachingEnabled: true,
  },
};
