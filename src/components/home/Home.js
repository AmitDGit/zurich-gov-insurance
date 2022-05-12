import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

const Home = () => {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();
  debugger;
  const [userAuthenticated, setuserAuthenticated] = useState({
    isAuthenticated: false,
    user: {
      name: "",
      email: "",
    },
    error: "",
  });
  if (!authState) return null;

  const login = async () => history.push("/login");

  const logout = async () => {
    oktaAuth.signOut();
  };

  const getuserDetails = async () => {
    const response = await oktaAuth.getUser();
    console.log(response);
  };
  if (authState.isAuthenticated) {
    getuserDetails();
  }
  const button = authState.isAuthenticated ? (
    <div>
      <div>
        <div>
          Access Token - <br></br> {oktaAuth.getAccessToken()} <br></br>
          <br></br>
        </div>
        <div>
          ID Token - <br></br> {oktaAuth.getIdToken()}
          <br></br>
          <br></br>
        </div>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <button onClick={login}>Login</button>
  );

  return (
    <div className="homescreen">
      <Link to="/">Home</Link>
      <br />
      <Link to="/dashboard">dashboard</Link>
      <br />
      {button}
    </div>
  );
};
export default Home;
