import React from "react";
import LoggedInUser from "./Loginuser";

function Header({ ...props }) {
  return (
    <div className="header-container">
      <div className="site-logo"></div>
      <div className="header-title">Technical Underwriting Connect (TUC)</div>
      <LoggedInUser />
    </div>
  );
}

export default Header;
