import React, { useEffect } from "react";

function Country({ ...props }) {
  useEffect(() => {
    props.menuClick({ currentMenu: "Country", isSubmenu: true });
  }, []);
  return <div>Country page</div>;
}

export default Country;
