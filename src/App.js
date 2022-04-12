import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Country from "./components/manage/country/Country";
import Lob from "./components/manage/lob/Lob";
import Region from "./components/manage/region/Region";
import Segment from "./components/manage/segment/Segment";
import Sublob from "./components/manage/sublob/Sublob";
import Navbar from "./components/navbar/Navbar";
import User from "./components/manage/user/User";
import Lookup from "./components/manage/lookup/Lookup";
import Lobchapter from "./components/manage/lobchapter/Lobchapter";
import ZNAOrgnization1 from "./components/manage/znaorgnization1/ZNAOrgnization1";
import ZNAOrgnization2 from "./components/manage/znaorgnization2/ZNAOrgnization2";
import ZNAOrgnization3 from "./components/manage/znaorgnization3/ZNAOrgnization3";
import Breachlog from "./components/breachlog/Breachlog";
import Rfelog from "./components/rfelog/Rfelog";
import Exemptionlog from "./components/exemptionlog/Exemptionlog";
import Unauthorized from "./components/unauthorized/Unauthorized";
import { PrivateRoute } from "./components/privateroute/PrivateRoute";
import { connect } from "react-redux";
import { appmenuActions } from "./actions/appmenu.action";
import TokenService from "./services/Tokenservice";
import Loginpage from "./components/loginpage/Loginpage";
import { oktaAuthConfig, oktaSignInConfig } from "./oktaauth/Config";

function ScrollToTop() {
  window.scrollTo(0, 0);
  return null;
}
function App({ state, menuClick }) {
  //added below code for okta
  /*const oktaAuth = new OktaAuth(oktaAuthConfig);
  const history = useHistory();
  const customAuthHandler = () => {
    history.push("/login");
  };
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };*/

  let userProfile;
  if (window.location.pathname === "/login") {
    //TokenService.removeUser();
  } else {
    userProfile = TokenService.getUser();
  }
  /*const updateWidthAndHeight = () => {
    const maincontainerwidth = document.querySelector(".main-container")
      .offsetWidth;
    const menucontainerwidth = document.querySelector(".menu-nav").offsetWidth;
    const pageviewcontainer = document.querySelector(".pageview-container");
    const marginwidth = 20;
    pageviewcontainer.style.width =      maincontainerwidth - menucontainerwidth - marginwidth + "px";
  };
  useEffect(() => {
    window.addEventListener("load", updateWidthAndHeight);
    window.addEventListener("resize", updateWidthAndHeight);
    return () => {
      window.removeEventListener("resize", updateWidthAndHeight);
      window.removeEventListener("load", updateWidthAndHeight);
    };
  }, []);*/

  return (
    <div className="container-fluid">
      <div className="main-container">
        <Router>
          <Header userProfile={userProfile} state={state}></Header>
          <ScrollToTop />
          <div className="site-container">
            <Route
              path="/"
              render={(routeParams) => (
                <Navbar
                  userProfile={userProfile}
                  state={state}
                  {...routeParams}
                />
              )}
            />
            <div className="pageview-container">
              <Switch>
                <PrivateRoute
                  path="/"
                  exact
                  component={Dashboard}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/region"
                  component={Region}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/country"
                  component={Country}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/segment"
                  component={Segment}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lob"
                  component={Lob}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/sublob"
                  component={Sublob}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lobchapter"
                  component={Lobchapter}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/znaorganization1"
                  component={ZNAOrgnization1}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/znaorganization2"
                  component={ZNAOrgnization2}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/znaorganization3"
                  component={ZNAOrgnization3}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/user"
                  component={User}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lookup"
                  component={Lookup}
                  menuClick={menuClick}
                />

                <PrivateRoute
                  path="/breachlogs"
                  component={Breachlog}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/rfelogs"
                  component={Rfelog}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/exemptionlogs"
                  component={Exemptionlog}
                  menuClick={menuClick}
                />
                <Route
                  path="/login"
                  component={Loginpage}
                  state={state}
                  menuClick={menuClick}
                />
                <Route
                  path="/unauthorized"
                  component={Unauthorized}
                  state={state}
                  menuClick={menuClick}
                />
                <Redirect from="*" to="/" />
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  menuClick: appmenuActions.menuClick,
};
export default connect(mapStateToProp, mapActions)(App);
