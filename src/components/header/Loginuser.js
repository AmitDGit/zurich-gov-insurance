import React from "react";
import locationlogo from "../../assets/location.png";
function LoggedInUser() {
  return (
    <div className="loggeduser-container">
      <div className="userregion-container">
        <div className="user-region">EMEA</div>
        <div className="user-country">Switzerland</div>
      </div>
      <div className="userregion-logo">
        <img src={locationlogo}></img>
      </div>
      <div className="user-image profile-picture">
        <img></img>
      </div>
    </div>
  );
}

export default LoggedInUser;
