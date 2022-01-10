import React from "react";

function UserProfile(props) {
  const { username, userEmail, imagePath } = props;
  return (
    <div className="approver-detail-block">
      <div className="approver-img">
        <img src={imagePath}></img>
      </div>
      <div>
        <div className="approver-name">{username}</div>
        <div className="approver-email">{userEmail}</div>
      </div>
    </div>
  );
}

export default UserProfile;
