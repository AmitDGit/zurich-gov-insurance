import React from "react";
import ReactTooltip from "react-tooltip";
function ToolTip(props) {
  const { place, effect } = props;
  return (
    <ReactTooltip
      effect={effect ? effect : "float"}
      place={place ? place : "top"}
      type="dark"
      multiline
      backgroundColor="#EBF4FB"
      textColor="#2167AD"
      html={true}
    ></ReactTooltip>
  );
}

export default ToolTip;
