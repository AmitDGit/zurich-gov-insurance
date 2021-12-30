import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
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
import { PrivateRoute } from "./components/privateroute/PrivateRoute";
import { connect } from "react-redux";
import { appmenuActions } from "./actions/appmenu.action";
import TokenService from "./services/Tokenservice";
import Loginpage from "./components/loginpage/Loginpage";
function ScrollToTop() {
  window.scrollTo(0, 0);
  return null;
}
function App({ state, menuClick }) {
  if (window.location.pathname === "/login") {
    //TokenService.removeUser();
  }
  return (
    <div className="container-fluid">
      <div className="main-container">
        <Router>
          <Header state={state}></Header>
          <ScrollToTop />
          <div className="site-container">
            <Route
              path="/"
              render={(routeParams) => (
                <Navbar state={state} {...routeParams} />
              )}
            />
            <div className="pageview-container">
              <Switch>
                <PrivateRoute
                  path="/"
                  exact
                  component={Dashboard}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/region"
                  component={Region}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/country"
                  component={Country}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/segment"
                  component={Segment}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lob"
                  component={Lob}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/sublob"
                  component={Sublob}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lobchapter"
                  component={Lobchapter}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/lookup"
                  component={Lookup}
                  state={state}
                  menuClick={menuClick}
                />
                <PrivateRoute
                  path="/user"
                  component={User}
                  state={state}
                  menuClick={menuClick}
                />
                <Route
                  path="/login"
                  component={Loginpage}
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
