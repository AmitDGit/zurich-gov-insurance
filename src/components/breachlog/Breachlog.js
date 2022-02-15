import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  breachlogActions,
  userActions,
  countryActions,
  regionActions,
  lookupActions,
} from "../../actions";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import PaginationData from "../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import AddEditForm from "./AddEditForm";
import UserProfile from "../common-components/UserProfile";
import FrmInput from "../common-components/frminput/FrmInput";

import moment from "moment";

function Breachlog({ ...props }) {
  const { breachlogState, countryState, regionState, userState } = props.state;
  const {
    getAll,
    getAllUsers,
    getAllCountry,
    getAllRegion,
    getAllStatus,
    getById,
    getLookupByType,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu(
    { currentMenu: "Breachlog", isSubmenu: false },
    props.menuClick
  );
  //initialize filter/search functionality
  //console.log(breachlogState);
  const selectInitiVal = { label: "Select", value: "" };
  const [commonfilterOpts, setcommonfilterOpts] = useState({
    classificationFilterOpts: [],
    groupFilterOpts: [],
    entriesFilterOpts: [
      { label: "My Entries", value: "My Entries" },
      { label: "All Entries", value: "All Entries" },
    ],
    customerSegmentFilterOpts: [],
    natureOfBreachFilterOpts: [],
    lobFilterOpts: [],
    actionResponsibleFilterOpts: [],
    statusFilterOpts: [],
  });
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const intialFilterState = {
    entityNumber: "",
    title: "",
    classification: "",
    group: "",
    customersegment: "",
    natureofbreach: "",
    lobid: "",
    actionResponsibleName: "",
    entries: "",
    regionId: "",
    countryId: "",
    status: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterInput = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });

    if (name === "regionId" && value !== "") {
      let countryopts = countryAllFilterOpts.filter(
        (item) => item.regionId === value
      );
      setcountryFilterOpts([selectInitiVal, ...countryopts]);
      setselfilter({
        ...selfilter,
        [name]: value,
        countryId: "",
      });
    } else if (name === "regionId" && value === "") {
      setcountryFilterOpts([selectInitiVal, ...countryAllFilterOpts]);
    }
  };
  const handleFilterSearch = () => {
    let tempdata = [...data];
    if (
      selfilter.entityNumber !== "" ||
      selfilter.title !== "" ||
      selfilter.classification !== "" ||
      selfilter.group !== "" ||
      selfilter.customersegment !== "" ||
      selfilter.natureofbreach !== "" ||
      selfilter.lobid !== "" ||
      selfilter.actionResponsibleName !== "" ||
      selfilter.entries !== "" ||
      selfilter.regionId !== "" ||
      selfilter.countryId !== ""
    ) {
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.entityNumber !== "" &&
          item.entityNumber &&
          !item.entityNumber.includes(selfilter.entityNumber)
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.title.trim() !== "" &&
          item.title &&
          !item.title
            .trim()
            .toLowerCase()
            .includes(selfilter.title.trim().toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.classification !== "" &&
          selfilter.classification !== item.classificationValue
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.group !== "" &&
          selfilter.group !== item.group
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.customersegment !== "" &&
          selfilter.customersegment !== item.customerSegment
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.natureofbreach !== "" &&
          selfilter.natureofbreach !== item.natureOfBreach
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.lobid !== "" &&
          selfilter.lobid !== item.lobid
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.actionResponsibleName !== "" &&
          selfilter.actionResponsibleName !== item.actionResponsibleName
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.entries !== "" &&
          selfilter.entries === "My Entries" &&
          item.createdByID !== userProfile.userId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.regionId !== "" &&
          selfilter.regionId !== item.regionId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.countryId !== "" &&
          selfilter.countryId !== item.countryId
        ) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    debugger;
    setselfilter(intialFilterState);
    setpaginationdata(data);
  };
  //set pagination data and functionality
  const [duedatepriority, setduedatepriority] = useState(15);
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const [exportData, setexportData] = useState([{ columns: [], data: [] }]);
  const columns = [
    {
      dataField: "duedate-priority",
      text: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let dueDate = moment(row.dueDate);
        let currentDate = moment();
        let duedatediff = dueDate.diff(currentDate, "days");

        let ishighpriority = duedatepriority > duedatediff ? true : false;
        return (
          <div
            className={`duedate-priority-icon ${ishighpriority ? "high" : ""}`}
            rowid={row.breachLogID}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "25px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            onClick={handleView}
            rowid={row.breachLogID}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "50px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.breachLogID}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "50px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "title",
      text: "Title",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "creatorName",
      text: "Created By",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "lobName",
      text: "LoB",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },

    {
      dataField: "classificationValue",
      text: "Classification",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "customerSegmentName",
      text: "Customer Segment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "natureOfBreachValue",
      text: "Nature of Breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "dateActionClosed",
      text: "Date Action Closed",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "actionResponsibleName",
      text: "Action Responsible",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "title",
      order: "asc",
    },
  ];

  useEffect(() => {
    getAllCountry();
    getAllRegion();
  }, []);

  const getAllBreachItems = (filters) => {
    let requestParam = {
      RequesterUserId: userProfile.userId,
      breachStatus: sellogType,
    };
    if (filters) {
      requestParam = filters;
    }
    if (sellogType) {
      getAll(requestParam);
    }
  };
  useEffect(() => {
    let tempdata = [];
    let tempcmmonfilterOpts = {
      classificationFilterOpts: [],
      groupFilterOpts: [],
      entriesFilterOpts: [
        selectInitiVal,
        { label: "My Entries", value: "My Entries" },
        { label: "All Entries", value: "All Entries" },
      ],
      customerSegmentFilterOpts: [],
      natureOfBreachFilterOpts: [],
      lobFilterOpts: [],
      actionResponsibleFilterOpts: [],
      statusFilterOpts: [],
    };
    // let classificationOptsObj= {};
    // let groupOptsObj= {};
    // let entriesOptsObj= {};
    let customerSegmentOptsObj = {};
    let natureOfBreachOptsObj = {};
    let lobOptsObj = {};
    let actionResponsibleOptsObj = {};
    let statusOptsObj = {};
    let countryOptsObj = {};
    let tempcountryOpts = [];
    let regionOptsObj = {};
    let tempregionOpts = [];
    userState.items.forEach((item) => {
      tempdata.push(item);
      if (!customerSegmentOptsObj[item.customerSegment]) {
        tempcmmonfilterOpts["customerSegmentFilterOpts"].push({
          label: item.customerSegmentName,
          value: item.customerSegment,
        });
        customerSegmentOptsObj[item.customerSegment] = item.customerSegmentName;
      }
      if (!natureOfBreachOptsObj[item.natureOfBreach]) {
        tempcmmonfilterOpts["natureOfBreachFilterOpts"].push({
          label: item.natureOfBreachValue,
          value: item.natureOfBreach,
        });
        natureOfBreachOptsObj[item.natureOfBreach] = item.natureOfBreachValue;
      }
      if (!lobOptsObj[item.lobid]) {
        tempcmmonfilterOpts["lobFilterOpts"].push({
          label: item.lobName,
          value: item.lobid,
        });
        lobOptsObj[item.lobid] = item.lobName;
      }
      if (
        !actionResponsibleOptsObj[item.actionResponsible] &&
        item.actionResponsible
      ) {
        tempcmmonfilterOpts["actionResponsibleFilterOpts"].push({
          label: item.actionResponsibleName,
          value: item.actionResponsibleName,
        });
        actionResponsibleOptsObj[item.actionResponsible] =
          item.actionResponsible;
      }
      if (!statusOptsObj[item.breachStatus]) {
        tempcmmonfilterOpts["classificationFilterOpts"].push({
          label: item.classificationValue,
          value: item.classificationValue,
        });
        statusOptsObj[item.breachStatus] = item.breachStatusValue;
      }
      if (!countryOptsObj[item.countryId]) {
        tempcountryOpts.push({
          label: item.countryName,
          value: item.countryId,
          regionId: item.regionId,
        });
        countryOptsObj[item.countryId] = item.countryName;
      }
      if (!regionOptsObj[item.regionId]) {
        tempregionOpts.push({
          label: item.regionName,
          value: item.regionId,
        });
        regionOptsObj[item.regionId] = item.regionName;
      }
    });

    tempcmmonfilterOpts["customerSegmentFilterOpts"].sort(dynamicSort("label"));
    tempcmmonfilterOpts["customerSegmentFilterOpts"].unshift(selectInitiVal);
    tempcmmonfilterOpts["natureOfBreachFilterOpts"].sort(dynamicSort("label"));
    tempcmmonfilterOpts["natureOfBreachFilterOpts"].unshift(selectInitiVal);
    tempcmmonfilterOpts["lobFilterOpts"].sort(dynamicSort("label"));
    tempcmmonfilterOpts["lobFilterOpts"].unshift(selectInitiVal);
    tempcmmonfilterOpts["actionResponsibleFilterOpts"].sort(
      dynamicSort("label")
    );
    tempcmmonfilterOpts["actionResponsibleFilterOpts"].unshift(selectInitiVal);
    tempcmmonfilterOpts["classificationFilterOpts"].sort(dynamicSort("label"));
    tempcmmonfilterOpts["classificationFilterOpts"].unshift(selectInitiVal);
    tempcountryOpts.sort(dynamicSort("label"));
    tempregionOpts.sort(dynamicSort("label"));
    setcommonfilterOpts(tempcmmonfilterOpts);
    setcountryFilterOpts([selectInitiVal, ...tempcountryOpts]);
    setcountryAllFilterOpts([...tempcountryOpts]);
    setregionFilterOpts([selectInitiVal, ...tempregionOpts]);
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
  }, [breachlogState.items]);

  const [countrymapping, setcountrymapping] = useState([]);
  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

  useEffect(() => {
    let selectOpts = [];
    let tempCountryMapping = [];
    let tempRegionListObj = {};

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        label: item.countryName.trim(),
        value: item.countryID,
        regionId: item.regionID,
      });

      if (!tempRegionListObj[item.regionID]) {
        tempCountryMapping.push({
          region: item.regionID,
          country: [
            {
              label: item.countryName,
              value: item.countryID,
            },
          ],
        });
      } else {
        tempCountryMapping.forEach((countryitem) => {
          if (countryitem.region === item.regionID) {
            countryitem.country.push({
              label: item.countryName,
              value: item.countryID,
            });
          }
        });
      }
      tempRegionListObj[item.regionID] = item.countryName;
    });
    selectOpts.sort(dynamicSort("label"));
    setfrmCountrySelectOpts([...selectOpts]);
    setcountrymapping([...tempCountryMapping]);
  }, [countryState.countryItems]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    regionState.regionItems.forEach((item) => {
      selectOpts.push({
        label: item.regionName.trim(),
        value: item.regionID,
      });
    });
    selectOpts.sort(dynamicSort("label"));
    setfrmRegionSelectOpts([...selectOpts]);
  }, [regionState.regionItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(formInitialValue);
    setisEditMode(false);
    setisReadMode(false);
    // getAllApprover({ UserName: "#$%" });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValue = {
    breachLogID: "",
    title: "",
    regionId: "",
    countryId: "",
    customerSegment: "",
    lobid: "",
    sublobid: "",
    classification: "",
    typeOfBreach: "",
    rootCauseOfTheBreach: "",
    natureOfBreach: "",
    materialBreach: false,
    dateBreachOccurred: null,
    details: "",
    rangeOfFinancialImpact: "",
    financialImpactDescription: "",
    howDetected: "",
    nearMisses: false,
    actionResponsible: "",
    originalDueDate: null,
    dueDate: null,
    actionPlan: "",
    breachStatus: "",
    dateActionClosed: null,
    actionUpdate: "",
    createdByID: "",
    createdDate: "",
    breachAttachmentList: [],
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);

  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ breachLogID: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
    });
    showAddPopup();
  };
  const handleView = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ breachLogID: itemid });
    setisReadMode(true);
    setformIntialState({
      ...response,
    });
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = await postItem({
      ...item,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      setselfilter(intialFilterState);
      getAllBreachItems();
      hideAddPopup();
      alert(alertMessage.breachlog.update);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    /*const { firstName, lastName, emailAddress } = item.user[0];
    let response = await checkNameExist({
      emailAddress: emailAddress,
    });*/

    let response = await postItem({
      ...item,
      createdByID: userProfile.userId,
    });

    if (response) {
      setselfilter(intialFilterState);
      getAllBreachItems();
      hideAddPopup();
      alert(alertMessage.breachlog.add);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.breachlog.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ UserId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ UserId: itemid });
      if (resonse) {
        getAll({ RequesterUserId: userProfile.userId });
        alert(alertMessage.breachlog.delete);
      }
    } else {
      alert(alertMessage.breachlog.isInUse);
    }
  };

  /* search Input functionality */
  const [searchOptions, setsearchOptions] = useState([]);
  useEffect(() => {
    setsearchOptions(userState.approverUsers);
  }, [userState.approverUsers]);
  /*filter open close functions */
  const [filterbox, setfilterbox] = useState(false);
  const handleFilterBoxState = () => {
    setfilterbox(!filterbox);
  };

  const [logTypes, setlogTypes] = useState([]);
  const [sellogType, setsellogType] = useState("");
  useEffect(async () => {
    let tempBreachStatus = await getLookupByType({
      LookupType: "BreachStatus",
    });
    tempBreachStatus = tempBreachStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    setlogTypes([...tempBreachStatus]);
    setsellogType(tempBreachStatus[0]["value"]);
  }, []);

  const openBreachlogTab = (type) => {
    setsellogType(type);
  };
  useEffect(() => {
    getAllBreachItems();
  }, [sellogType]);

  return (
    <>
      {isshowAddPopup ? (
        <AddEditForm
          title={isReadMode ? "View Breach Log" : "Add/Edit Breach Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          formIntialState={formIntialState}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmCountrySelectOpts={frmCountrySelectOpts}
          countrymapping={countrymapping}
        ></AddEditForm>
      ) : (
        <>
          <div className="page-title">Breach Log</div>
          {filterbox ? (
            <div className="page-filter collapsable">
              <div className="filter-container">
                <div className="frm-filter">
                  <FrmInput
                    title={"Entry Number"}
                    name={"entityNumber"}
                    type={"input"}
                    handleChange={onSearchFilterInput}
                    value={selfilter.entityNumber}
                  />
                </div>
                <div className="frm-filter">
                  <FrmInput
                    title={"Title"}
                    name={"title"}
                    type={"input"}
                    handleChange={onSearchFilterInput}
                    value={selfilter.title}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Classification"}
                    name={"classification"}
                    selectopts={commonfilterOpts.classificationFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.classification}
                  />
                </div>
                {/*<div className="frm-filter no-margin">
                  <FrmSelect
                    title={"Group"}
                    name={"group"}
                    selectopts={commonfilterOpts.groupFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.group}
                  />
          </div>*/}
                <div className="frm-filter">
                  <FrmSelect
                    title={"Customer Segment"}
                    name={"customersegment"}
                    selectopts={commonfilterOpts.customerSegmentFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.customersegment}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Nature of Breach"}
                    name={"natureofbreach"}
                    selectopts={commonfilterOpts.natureOfBreachFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.natureofbreach}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"LoB"}
                    name={"lobid"}
                    selectopts={commonfilterOpts.lobFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.lobid}
                  />
                </div>
                <div className="frm-filter no-margin">
                  <FrmSelect
                    title={"Action Responsible"}
                    name={"actionResponsibleName"}
                    selectopts={commonfilterOpts.actionResponsibleFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.actionResponsibleName}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Entries"}
                    name={"entries"}
                    selectopts={commonfilterOpts.entriesFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.entries}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Region"}
                    name={"regionId"}
                    selectopts={regionFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.regionId}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Country"}
                    name={"countryId"}
                    selectopts={countryFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.countryId}
                  />
                </div>
              </div>
              <div className="btn-container">
                <div
                  className={`btn-blue ${
                    selfilter.entityNumber !== "" ||
                    selfilter.title !== "" ||
                    selfilter.classification !== "" ||
                    selfilter.group !== "" ||
                    selfilter.customersegment !== "" ||
                    selfilter.natureofbreach !== "" ||
                    selfilter.lobid !== "" ||
                    selfilter.actionResponsibleName !== "" ||
                    selfilter.entries !== "" ||
                    selfilter.regionId !== "" ||
                    selfilter.countryId !== ""
                      ? ""
                      : "disable"
                  }`}
                  onClick={handleFilterSearch}
                >
                  Search
                </div>
                <div className="btn-blue" onClick={clearFilter}>
                  Clear
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div
            className={`filter-btn-container ${
              filterbox ? "opencls" : "closecls"
            }`}
          >
            <div className="filter-btn" onClick={handleFilterBoxState}>
              Filters
            </div>
          </div>
          <div className="tabs-container">
            {logTypes.map((item) => (
              <div
                key={item.value}
                className={`tab-btn ${
                  sellogType === item.value ? "selected" : "normal"
                }`}
                onClick={() => openBreachlogTab(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            {userState.loading ? (
              <Loading />
            ) : userState.error ? (
              <div>{userState.error}</div>
            ) : (
              <PaginationData
                id={"userId"}
                column={columns}
                data={paginationdata}
                showAddPopup={showAddPopup}
                defaultSorted={defaultSorted}
                isExportReport={true}
                exportReportTitle={"Export"}
                exportFileName={"BreachLogReport"}
                buttonTitle={"New Breach"}
                hidesearch={true}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: breachlogActions.getAll,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAllStatus: breachlogActions.getAllStatus,
  getById: breachlogActions.getById,
  checkIsInUse: breachlogActions.checkIsInUse,
  postItem: breachlogActions.postItem,
  deleteItem: breachlogActions.deleteItem,
  getLookupByType: lookupActions.getLookupByType,
};

export default connect(mapStateToProp, mapActions)(Breachlog);
