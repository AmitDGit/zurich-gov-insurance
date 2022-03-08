import React, { useEffect } from "react";
import { connect } from "react-redux";
import { regionActions } from "../../actions";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
function Dashboard({ ...props }) {
  const { getAllRegions } = props;
  useSetNavMenu(
    { currentMenu: "Dashboard", isSubmenu: false },
    props.menuClick
  );
  useEffect(() => {
    //getAllRegions();
  }, []);
  return <div>Dashboard Page</div>;
}

const mapActions = {
  getAllRegions: regionActions.getAll,
};
export default connect(null, mapActions)(Dashboard);
