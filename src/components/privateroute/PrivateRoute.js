import React from "react";
import { Route, Redirect } from "react-router-dom";
import TokenService from "../../services/Tokenservice";
import { connect } from "react-redux";
const PrivateRoute = ({ component: Component, ...rest }) => {
  //let userProfile = TokenService.getUser();
  const { userprofileState } = rest.state;
  let userProfile = userprofileState.userProfile
    ? userprofileState.userProfile
    : {};
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
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
export default connect(mapStateToProp)(PrivateRoute);
