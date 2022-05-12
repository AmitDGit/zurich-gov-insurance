import React, { useEffect } from "react";
import { connect } from "react-redux";
import { appmenuActions } from "../../actions";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
function Dashboard({ ...props }) {
  const { menuClick } = props;
  //useSetNavMenu({ currentMenu: "Dashboard", isSubmenu: false }, menuClick);
  useEffect(() => {
    //getAllRegions();
  }, []);
  return <div>Dashboard Page</div>;
}

const mapActions = {
  menuClick: appmenuActions.menuClick,
};
export default connect(null, mapActions)(Dashboard);
