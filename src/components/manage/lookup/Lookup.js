import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { lookupActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import FrmInlineInput from "../../common-components/FrmInlineInput";
function Lookup({ ...props }) {
  const { lookupState } = props.state;
  const {
    getAllBreachLog,
    getLogTypes,
    getById,
    checkNameExist,
    checkIsInUse,
    postBrachLogItem,
    deleteItem,
    userProfile,
  } = props;
  console.log(lookupState);
  useSetNavMenu({ currentMenu: "Lookup", isSubmenu: true }, props.menuClick);
  const [logtypeFilterOpts, setlogtypeFilterOpts] = useState([]);
  const intialfilterval = {
    logtype: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const handleFilterSearch = async () => {
    if (selfilter.logtype !== "") {
      if (selfilter.logtype === "1") {
        getAllBreachLog({ RequesterUserId: userProfile.userId });
      } else if (selfilter.logtype === "2") {
        setdata(JSON.parse(JSON.stringify(rfelogData)));
      } else if (selfilter.logtype === "3") {
        setdata(JSON.parse(JSON.stringify(exemptionlogData)));
      }
    } else {
      setdata([]);
      setlookuptypes([]);
    }
  };
  const clearFilter = () => {
    setselfilter(intialfilterval);
    setdata([]);
    setlookuptypes([]);
  };
  const [breachlogData, setbreachlogData] = useState([]);
  const [breachlookupTypes, setbreachlookupTypes] = useState([]);
  const [rfelogData, setrfelogData] = useState({});
  const [exemptionlogData, setexemptionlogData] = useState({});
  const [data, setdata] = useState([]);
  const [lookuptyps, setlookuptypes] = useState([]);

  const [issubmitted, setissubmitted] = useState(false);
  useEffect(() => {
    getLogTypes({ LookupType: "logs", RequesterUserId: userProfile.userId });
  }, []);

  useEffect(() => {
    let templookuptypes = [];
    let tempObj = {};
    lookupState.breachlogitems.forEach((item) => {
      if (!tempObj[item["lookUpType"]]) {
        templookuptypes.push({ type: item["lookUpType"] });
      }
      tempObj[item["lookUpType"]] = item["lookUpType"];
    });
    setbreachlookupTypes(templookuptypes);
    setbreachlogData(lookupState.breachlogitems);
    if (selfilter.logtype === "1") {
      setdata(lookupState.breachlogitems);
      setlookuptypes(templookuptypes);
    }
  }, [lookupState.breachlogitems]);

  useEffect(() => {
    let templottypefilterOpts = [];
    lookupState.logtyps.forEach((item) => {
      templottypefilterOpts.push({
        label: item.lookUpName,
        value: item.lookupID,
      });
    });
    setlogtypeFilterOpts([...templottypefilterOpts]);
  }, [lookupState.logtyps]);

  const [isAddItem, setAddItem] = useState({ type: false, nature: false });

  const [formfield, setformfield] = useState({});
  const handleAdd = (param) => {
    setAddItem({ ...isAddItem, [param.lookUpType]: true });
  };
  const handleEdit = (param) => {
    const tempData = [...data];
    tempData.forEach((item) => {
      if (item.lookupID === param.lookupID) {
        item.isEditMode = true;
      }
    });
    setdata([...tempData]);
  };
  const handleSave = async (param) => {
    let item = {};
    let response;
    if (param.lookupID) {
      item = data.filter((item) => item.lookupID == param.lookupID);
    } else {
      response = await checkNameExist({
        lookUpType: param.lookUpType,
        lookUpValue: formfield[param.lookUpType],
      });
    }
    if (!response) {
      if (param.lookupID) {
        response = await postBrachLogItem({
          lookupID: param.lookupID,
          lookUpType: param.lookUpType,
          lookUpValue: item[0].lookUpValue,
        });
      } else {
        response = await postBrachLogItem({
          lookUpType: param.lookUpType,
          lookUpValue: formfield[param.lookUpType],
        });
      }

      if (response) {
        getAllBreachLog({ RequesterUserId: userProfile.userId });
        if (param.lookupID) {
          alert(alertMessage.lookup.update);
        } else {
          alert(alertMessage.lookup.add);
        }
      }
    } else {
      alert(alertMessage.lookup.nameExist);
    }
    setAddItem({
      ...isAddItem,
      [param.lookUpType]: false,
    });
  };
  const handleDelete = async (param) => {
    if (!window.confirm(alertMessage.lookup.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      lookupID: param.lookupID,
      lookUpType: param.lookUpType,
    });
    if (!resonse) {
      resonse = await deleteItem({ lookupID: param.lookupID });
      if (resonse) {
        getAllBreachLog();
        alert(alertMessage.lookup.delete);
      }
    } else {
      alert(alertMessage.lob.isInUse);
    }
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let lookupID = e.target.getAttribute("itemid");
    let tempData = [...data];

    tempData.forEach((item) => {
      if (item.lookupID === lookupID) {
        item.lookUpValue = value;
      }
    });
    setdata([...tempData]);
  };
  const pageFilterStyle = { justifyContent: "flex-start" };
  const tableiconclmStyle = { width: "40px" };
  return (
    <>
      <div className="page-title">Manage Lookup</div>
      <div className="page-filter" style={pageFilterStyle}>
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"Log Type"}
              name={"logtype"}
              selectopts={logtypeFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.logtype}
            />
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${selfilter.logtype === "" ? "disable" : ""}`}
            onClick={handleFilterSearch}
          >
            Search
          </div>
        </div>
      </div>
      <div>
        {lookupState.loading ? (
          <Loading />
        ) : lookupState.error ? (
          <div>{lookupState.error}</div>
        ) : data.length ? (
          <div className="lookup-content-container">
            <div className="lookup-type">
              {lookuptyps.map((lookuptype) => {
                return (
                  <>
                    <div className="lookup-title-header">
                      <div className="title">{lookuptype.type}</div>
                      <div
                        className={`btn-blue`}
                        onClick={() =>
                          handleAdd({
                            lookUpType: lookuptype.type,
                            lookupID: "",
                          })
                        }
                      >
                        Add
                      </div>
                    </div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={tableiconclmStyle}>Edit</th>
                          <th style={tableiconclmStyle}>Delete</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isAddItem[lookuptype.type] ? (
                          <tr>
                            <td
                              style={tableiconclmStyle}
                              className="save-icon"
                              onClick={() =>
                                handleSave({
                                  lookUpType: lookuptype.type,
                                  lookupID: "",
                                })
                              }
                            ></td>
                            <td
                              className="delete-icon"
                              onClick={() =>
                                handleDelete({
                                  lookUpType: lookuptype.type,
                                  lookupID: "",
                                })
                              }
                            ></td>
                            <td>
                              <FrmInlineInput
                                placeholder={"Add value here"}
                                name={lookuptype.type}
                                value={formfield[lookuptype.type]}
                                type={"text"}
                                handleChange={handleNewChange}
                                isRequired={true}
                                validationmsg={"Mandatory field"}
                                issubmitted={issubmitted}
                              />
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}
                        {data.map((item) => {
                          return lookuptype.type == item.lookUpType ? (
                            <tr>
                              <td
                                style={tableiconclmStyle}
                                className={`${
                                  item.isEditMode ? "save-icon" : "edit-icon"
                                }`}
                                onClick={() => {
                                  item.isEditMode
                                    ? handleSave({
                                        lookUpType: lookuptype.type,
                                        lookupID: item.lookupID,
                                      })
                                    : handleEdit({
                                        lookUpType: lookuptype.type,
                                        lookupID: item.lookupID,
                                      });
                                }}
                                rowid={item.lookupID}
                              ></td>
                              <td
                                className="delete-icon"
                                onClick={() =>
                                  handleDelete({
                                    lookUpType: lookuptype.type,
                                    lookupID: item.lookupID,
                                  })
                                }
                                rowid={item.lookupID}
                              ></td>
                              <td>
                                {item.isEditMode ? (
                                  <FrmInlineInput
                                    placeholder={"Add value here"}
                                    name={lookuptype.type}
                                    value={item.lookUpValue}
                                    type={"text"}
                                    itemid={item.lookupID}
                                    handleChange={handleEditChange}
                                    isRequired={true}
                                    validationmsg={"Mandatory field"}
                                    issubmitted={issubmitted}
                                  />
                                ) : (
                                  item.lookUpValue
                                )}
                              </td>
                            </tr>
                          ) : (
                            ""
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAllBreachLog: lookupActions.getAllBreachLog,
  getLogTypes: lookupActions.getLogTypes,
  getById: lookupActions.getById,
  checkNameExist: lookupActions.checkNameExist,
  checkIsInUse: lookupActions.checkIsInUse,
  postBrachLogItem: lookupActions.postBrachLogItem,
  deleteItem: lookupActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Lookup);
