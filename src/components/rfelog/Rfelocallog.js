import React, { useState, useEffect } from "react";
import Popup from "../common-components/Popup";
import { rfelogActions } from "../../actions";
function Rfelocallog(props) {
  const { title, hidePopup } = props;

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
          <div>
            <ul>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/Malaysia%20Referral%20Log/Default%20View.aspx"
                  target="_blank"
                >
                  Malaysia
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/Indonesia%20Referral%20Log/Default%20View.aspx"
                  target="_blank"
                >
                  Indonesia
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Russia/AllItems.aspx"
                  target="_blank"
                >
                  Russia
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Nordic/Default%20View.aspx"
                  target="_blank"
                >
                  Nordic
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/Italy%20Retail%20Local%20Request%20for%20Empowerment%20Log/Default%20View%20%20My%20Referrals.aspx"
                  target="_blank"
                >
                  Italy Retail
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/01/Lists/GI%20Italy%20Local%20Referral%20Log/Default%20View.aspx"
                  target="_blank"
                >
                  Italy Old GI
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/LatAm%20RFE%20Active/AllItems.aspx"
                  target="_blank"
                >
                  LatAm
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Germany/Default%20View.aspx"
                  target="_blank"
                >
                  Germany CI
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/Germany%20GI/Default%20View.aspx"
                  target="_blank"
                >
                  Germany Retail
                </a>
              </li>
              <li>
                <a
                  href="https://zurichinsurance.sharepoint.com/sites/001295/Lists/GC%20Spain/Default%20View.aspx"
                  target="_blank"
                >
                  Spain CI
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default Rfelocallog;
