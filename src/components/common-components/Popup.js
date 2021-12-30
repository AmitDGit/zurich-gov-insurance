import React from "react";
import ReactDOM from "react-dom";
function Popup(props) {
  return ReactDOM.createPortal(
    <div className="popup-container">
      <div className="popup-sheen"></div>
      {props.children}
    </div>,
    document.getElementById("popupPortal")
  );
}

export default Popup;
