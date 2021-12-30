import React from "react";
import { Route, Redirect } from "react-router-dom";
import TokenService from "../../services/Tokenservice";
export const PrivateRoute = ({ component: Component, ...rest }) => {
  let userProfile = TokenService.getUser();
  return (
    <Route
      {...rest}
      render={(props) => {
        return TokenService.getLocalAccessToken() ? (
          <Component userProfile={userProfile} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};
