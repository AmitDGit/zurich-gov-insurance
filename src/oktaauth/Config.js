const oktaAuthConfig = {
  // Note: If your app is configured to use the Implicit flow
  // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
  // you will need to add `pkce: false`
  issuer: "https://dev-30156557.okta.com/oauth2/default",
  clientId: "0oa3rvubu3BgMry5F5d7",
  redirectUri: window.location.origin + "/login/callback",
  postLogoutRedirectUri: window.location.origin + "/login",
  logoutUrl: window.location.origin + "/login",
  scopes: ["openid", "profile", "email"],
};

const oktaSignInConfig = {
  baseUrl: "https://dev-30156557.okta.com",
  clientId: "0oa3rvubu3BgMry5F5d7",
  redirectUri: window.location.origin + "/login/callback",
  postLogoutRedirectUri: window.location.origin + "/login",
  logoutUrl: window.location.origin + "/login",
  scopes: ["openid", "profile", "email"],
  authParams: {
    // If your app is configured to use the Implicit flow
    // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
    // you will need to uncomment the below line
    // pkce: false
  },
  disableHttpsCheck: true,
  // Additional documentation on config options can be found at https://github.com/okta/okta-signin-widget#basic-config-options
};

export { oktaAuthConfig, oktaSignInConfig };
