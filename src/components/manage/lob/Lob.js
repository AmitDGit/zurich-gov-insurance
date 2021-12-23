import React, { useEffect } from "react";

function Lob({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Lob", isSubmenu: true });
  }, []);
  return <div>Lob Page</div>;
}

export default Lob;
