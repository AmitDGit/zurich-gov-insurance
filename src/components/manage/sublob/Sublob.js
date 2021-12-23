import React, { useEffect } from "react";

function Sublob({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Sublob", isSubmenu: true });
  }, []);
  return <div>Sub-lob page</div>;
}

export default Sublob;
