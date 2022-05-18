import React, { useState } from "react";
import "./Style.css";
import Popup from "../common-components/Popup";
import { formatDate } from "../../helpers";
import parse from "html-react-parser";
import moment from "moment";
function VersionHistoryPopup(props) {
  const {
    versionHistoryData,
    exportFieldTitles,
    exportDateFields,
    exportHtmlFields,
    versionHistoryExcludeFields,
    hidePopup,
  } = props;
  const [versionData, setversionData] = useState(versionHistoryData);
  const [order, setorder] = useState(true);
  const reverseorder = () => {
    setversionData([...versionData.reverse()]);
    setorder(!order);
  };
  return (
    <Popup {...props}>
      <div className="popup-box versionhistory">
        <div className="popup-header-container">
          <div className="popup-header-title">Version History</div>
          <div className="popup-close" onClick={() => hidePopup()}>
            X
          </div>
        </div>
        <div className="popup-content">
          <div className="versionhistory-container">
            {versionData.length ? (
              <>
                <div>All Versions</div>
                <div className="versionhistory-data-container">
                  <table>
                    <tr style={{ position: "relative", color: "#2167ad" }}>
                      <th
                        className={`${order ? "down-arrow" : "up-arrow"} `}
                        style={{ width: "40px" }}
                        onClick={() => reverseorder()}
                      >
                        No
                      </th>
                      <th style={{ width: "220px" }}>Modified</th>
                      <th>Modified By</th>
                    </tr>
                    {versionData.map((item, i) => {
                      return (
                        <tbody class="reversible">
                          <tr>
                            <td>{`${item["VersionNo"]}.0`}</td>
                            <td style={{ color: "#243E6F" }}>
                              {" "}
                              {item["ModifiedDate"]
                                ? moment(item["ModifiedDate"]).format(
                                    "DD-MMM-YYYY hh:mm:ss A"
                                  )
                                : ""}
                            </td>
                            <td>
                              {item["LastModifiorName"]
                                ? item["LastModifiorName"]
                                : ""}
                            </td>
                          </tr>
                          {Object.keys(exportFieldTitles).map((key, i) => {
                            if (
                              item[key] !== undefined &&
                              !versionHistoryExcludeFields[key]
                            ) {
                              return (
                                <tr class="linktoparent">
                                  <td></td>
                                  <td>{exportFieldTitles[key]}</td>
                                  <td>
                                    {exportDateFields[key]
                                      ? item[key]
                                        ? formatDate(item[key])
                                        : ""
                                      : exportHtmlFields.includes(key)
                                      ? item[key]
                                        ? parse(item[key])
                                        : ""
                                      : item[key] === true ||
                                        item[key] === false
                                      ? item[key]
                                        ? "Yes"
                                        : "No"
                                      : item[key]
                                      ? item[key]
                                      : ""}
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      );
                    })}
                  </table>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default VersionHistoryPopup;
