import React, { useEffect } from "react";

function Lobchapter({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Lobchapter", isSubmenu: true });
  }, []);
  return <div>Lobchapter page</div>;
}

export default Lobchapter;
