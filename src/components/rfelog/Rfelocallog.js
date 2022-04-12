import React, { useState, useEffect } from "react";
import Popup from "../common-components/Popup";
import { rfelogActions } from "../../actions";
function Rfelocallog(props) {
  const { title, locallinks, hidePopup } = props;
  return (
    <Popup {...props}>
      <div className="popup-box medium">
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hidePopup()}>
            X
          </div>
        </div>
        <div className="popup-content">
          <div className="country-local-links">
            <ul>
              {locallinks.map((item) => (
                <li>
                  <a
                    href={`${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.country}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default Rfelocallog;
