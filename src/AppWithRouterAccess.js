import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import {
  Security,
  SecureRoute,
  LoginCallback,
  useOktaAuth,
} from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import Loginpage from "./components/loginpage/Loginpage";
import Header from "./components/header/Header";

import OktaLogin from "./components/auth/OktaLogin";
import { oktaAuthConfig, oktaSignInConfig } from "./oktaauth/Config";

const oktaAuth = new OktaAuth(oktaAuthConfig);

const AppWithRouterAccess = ({ state, menuClick }) => {
  const history = useHistory();
  const customAuthHandler = () => {
    history.push("/login");
  };
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };
  const securecomponent = () => {
    return <></>;
  };
  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Header></Header>

      <Switch>
        <Route
          path="/login"
          render={() => <OktaLogin config={oktaSignInConfig} />}
        />
        <SecureRoute path="/" component={securecomponent} />
        <Route path="/login/callback" component={LoginCallback} />
      </Switch>
    </Security>
  );
};
export default AppWithRouterAccess;
