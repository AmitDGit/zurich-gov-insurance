import React from "react";
import profileimage from "../../assets/profileimage.png";

function UserProfile(props) {
  const { username, userEmail, imagePath } = props;
  return (
    <div className="approver-detail-block">
      <div className="approver-img">
        <img src={profileimage}></img>
      </div>
      <div>
        <div className="approver-name">{username}</div>
        <div className="approver-email">{userEmail}</div>
      </div>
    </div>
  );
}

export default UserProfile;
