import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { config, myMsal, loginRequest } from "../../azurauth/Config";
import { getUserDetails } from "./Graphservice";
import { setAccessToken } from "../../helpers";
function Login({ ...props }) {
  const [authenticated, setauthenticated] = useState({
    error: null,
    isAuthenticated: false,
    user: {},
    accessToken: "",
  });
  const [accountId, setaccountId] = useState(null);
  useEffect(() => {
    login();
  }, []);
  const login = async () => {
    debugger;
    try {
      let account;
      const currentAccounts = myMsal.getAllAccounts();
      if (currentAccounts.length !== 0) {
        account = currentAccounts[0];
      } else {
        const response = await myMsal.loginPopup(loginRequest);
        myMsal.setActiveAccount(response.account);
        setaccountId(response.account.homeAccountId);
        account = myMsal.getAllAccounts()[0];
      }

      const accessTokenRes = await getAccessToken(account);

      if (accessTokenRes.accessToken) {
        var user = await getUserDetails(accessTokenRes);
        setauthenticated({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName,
          },
          accessToken: accessTokenRes.accessToken,
          error: "",
        });
        setAccessToken({
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName,
          },
          accessToken: accessTokenRes.accessToken,
        });
      }
    } catch (err) {
      console.log(err);
      setauthenticated({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  };
  const getAccessToken = async (account) => {
    try {
      let response = await myMsal.acquireTokenSilent({
        scopes: config.scopes,
        account: account,
      });
      return response;
    } catch (err) {
      setauthenticated({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
  };
  return (
    <>
      {authenticated.isAuthenticated ? (
        <Redirect to="/" />
      ) : (
        <p>
          <button onClick={() => login()}>Log in</button>
        </p>
      )}
    </>
  );
}

export default Login;
