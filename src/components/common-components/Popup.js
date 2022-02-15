import React, { useEffect } from "react";
import ReactDOM from "react-dom";
function ScrollToTop() {
  window.scrollTo(0, 0);
  return null;
}
function Popup(props) {
  useEffect(() => {
    document.getElementById(
      "popupPortal"
    ).style.height = document.getElementById("root").style.height;
  }, []);
  return ReactDOM.createPortal(
    <div className="popup-container">
      <ScrollToTop />
      <div className="popup-sheen"></div>
      {props.children}
    </div>,
    document.getElementById("popupPortal")
  );
}

export default Popup;
