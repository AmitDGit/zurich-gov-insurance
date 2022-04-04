import React from "react";
import { Link } from "react-router-dom";
import "./Style.css";
function Unauthorized() {
  return (
    <div className="unauthorized-message">
      <h1>Unauthorized Access</h1>
      <br></br>
      <p>
        You do not have access to this page. Click <a href="/">here</a>
        &nbsp;to navigate to the Dashboard.
      </p>
    </div>
  );
}

export default Unauthorized;
