import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { loginuserAction } from "../../actions/loginuser.action";
import { regionActions } from "../../actions/region.action";
import { Redirect } from "react-router-dom";
import TokenService from "../../services/Tokenservice";
import "./Style.css";
function Loginpage({ ...props }) {
  const { loginState, login } = props;
  const [state, setState] = useState({
    username: "",
    password: "",
    submitted: false,
  });
  useEffect(() => {
    TokenService.removeUser();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    setState({ ...state, submitted: true });
    const { username, password } = state;
    if (username && password) {
      login(username, password);
    }
  };
  return (
    <>
      {loginState.loggedIn ? <Redirect to="/" /> : ""}
      <div>
        <div className="login-div">
          <div className="jumbotron">
            <div className="d-flex justify-content-center">
              <div className="login ">
                <div className="ico-tna login-logo"></div>
                <h2>Welcome</h2>
                <p>Login to get start!</p>
                <form name="form" onSubmit={handleSubmit}>
                  <div
                    className={
                      "form-group" +
                      (state.submitted && !state.username ? " has-error" : "")
                    }
                  >
                    <label htmlFor="username"></label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={state.username}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {state.submitted && !state.username && (
                      <div className="help-block">Email is required</div>
                    )}
                  </div>
                  <div
                    className={
                      "form-group" +
                      (state.submitted && !state.password ? " has-error" : "")
                    }
                  >
                    <label htmlFor="password"></label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={state.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    {state.submitted && !state.password && (
                      <div className="help-block">Password is required</div>
                    )}
                  </div>
                  <br />
                  <div className="form-group">
                    <button className="login-btn">Login</button>
                    {loginState.loggingIn && (
                      <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    )}
                    {/* <Link to="/register" className="btn btn-link">Register</Link> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    loginState: state.loginState,
  };
};
const mapActions = {
  login: loginuserAction.login,
  logout: loginuserAction.logout,
};

export default connect(mapStateToProp, mapActions)(Loginpage);
