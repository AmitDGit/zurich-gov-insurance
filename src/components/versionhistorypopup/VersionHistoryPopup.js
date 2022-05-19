import React, { useState } from "react";
import "./Style.css";
import Popup from "../common-components/Popup";
import { formatDate, dynamicSort } from "../../helpers";
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
    isDraft,
  } = props;
  const [versionData, setversionData] = useState(
    versionHistoryData.sort(dynamicSort("VersionNo", "Des"))
  );
  const [order, setorder] = useState(true);
  const [sortColumn, setsortColumn] = useState("VersionNo");
  const sortDataVersion = (sortType) => {
    let tempdata = [...versionData];
    let temporder = order ? "Asc" : "Des";
    tempdata.sort(dynamicSort(sortType, temporder));
    setversionData([...tempdata]);
    setorder(!order);
    setsortColumn(sortType);
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
            {!isDraft ? (
              versionData.length ? (
                <>
                  <div>All Versions</div>
                  <div className="versionhistory-data-container">
                    <table>
                      <tr style={{ position: "relative", color: "#2167ad" }}>
                        <th
                          style={{ width: "40px" }}
                          onClick={() => sortDataVersion("VersionNo")}
                        >
                          <div>No</div>
                          <div
                            className={`${
                              sortColumn === "VersionNo" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
                        <th
                          style={{ width: "220px" }}
                          onClick={() => sortDataVersion("ModifiedDate")}
                        >
                          <div>Modified</div>
                          <div
                            className={`${
                              sortColumn === "ModifiedDate" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
                        <th onClick={() => sortDataVersion("LastModifiorName")}>
                          <div>Modified By</div>
                          <div
                            className={`${
                              sortColumn === "LastModifiorName" ? "sort" : ""
                            } ${order ? "down-arrow" : "up-arrow"} `}
                          ></div>
                        </th>
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
              )
            ) : (
              <div>
                <b>No version history will be saved for the Draft.</b>
              </div>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default VersionHistoryPopup;
