import { PublicClientApplication } from "@azure/msal-browser";
export const config = {
  appId: process.env.REACT_APP_AZURAPP_ID,
  redirectUri: document.getElementById("root").baseURI,
  postLogoutRedirectUri: document.getElementById("root").baseURI,
  scopes: ["user.read"],
  authority: process.env.REACT_APP_AUTHORITY,
};
export const myMsal = new PublicClientApplication({
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri,
    authority: config.authority,
    postLogoutRedirectUri: config.postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
});
export const loginRequest = {
  scopes: config.scopes,
  prompt: "select_account",
  mainWindowRedirectUri: config.redirectUri,
};
export const logoutRequest = {
  account: myMsal.getAccountByHomeId(),
  mainWindowRedirectUri: config.postLogoutRedirectUri,
};
