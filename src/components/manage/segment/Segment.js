import React, { useEffect } from "react";

function Segment({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Segment", isSubmenu: true });
  }, []);
  return <div>Segment Page</div>;
}

export default Segment;
