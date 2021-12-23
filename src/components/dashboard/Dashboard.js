import React, { useEffect } from "react";
function Dashboard({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Dashboard", isSubmenu: false });
  }, []);
  return <div>Dashboard Page</div>;
}

export default Dashboard;
