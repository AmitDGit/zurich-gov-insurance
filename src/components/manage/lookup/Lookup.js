import React, { useEffect } from "react";

function Lookup({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Lookup", isSubmenu: true });
  }, []);
  return <div>Lookup page</div>;
}

export default Lookup;
