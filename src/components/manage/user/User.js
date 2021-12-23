import React, { useEffect } from "react";

function User({ ...props }) {
  const { appmenu } = props.state;
  useEffect(() => {
    props.menuClick({ currentMenu: "User", isSubmenu: true });
  }, []);
  return <div>User page</div>;
}

export default User;
