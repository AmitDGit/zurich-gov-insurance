import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  breachlogActions,
  userActions,
  countryActions,
  regionActions,
  lookupActions,
  segmentActions,
  lobActions,
  commonActions,
} from "../../actions";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import PaginationData from "../common-components/PaginationData";
import {
  alertMessage,
  dynamicSort,
  formatDate,
  getUrlParameter,
} from "../../helpers";
import AddEditForm from "./AddEditForm";
import FrmInput from "../common-components/frminput/FrmInput";
import { BREACH_LOG_STATUS } from "../../constants";
import moment from "moment";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
import VersionHistoryPopup from "../versionhistorypopup/VersionHistoryPopup";
let pageIndex = 1;
let totalLogCount = 0;
function Breachlog({ ...props }) {
  const {
    breachlogState,
    countryState,
    regionState,
    segmentState,
    lobState,
  } = props.state;
  const {
    getallLogs,
    getActionResponsible,
    getAllCountry,
    getAllRegion,
    getAlllob,
    getAllSegment,
    getById,
    getLookupByType,
    postItem,
    userProfile,
    sendLogNotification,
    getDataVersion,
  } = props;

  useSetNavMenu(
    {
      currentMenu: "Breachlog",
      isSubmenu: false,
    },
    props.menuClick
  );

  const [logstate, setlogstate] = useState({
    loading: true,
    error: "",
    data: [],
    loadedAll: false,
  });
  const [logsDraftData, setlogsDraftData] = useState([]);
  //initialize filter/search functionality
  //console.log(breachlogState);
  const selectInitiVal = {
    label: "Select",
    value: "",
  };

  const exportExcludeFields = [
    "breachLogID",
    "regionId",
    "countryId",
    "customerSegment",
    "lobid",
    "classification",
    "typeOfBreach",
    "rootCauseOfTheBreach",
    "natureOfBreach",
    "rangeOfFinancialImpact",
    "financialImpactDescription",
    "howDetected",
    "breachStatus",
    "createdByID",
    "totalCount",
    "sublobid",
    "isSubmit",
    "znaSegmentId",
    "znasbuId",
    "marketBasketId",
  ];
  const exportDateFields = {
    dateBreachOccurred: "dateBreachOccurred",
    dueDate: "dueDate",
    originalDueDate: "originalDueDate",
    dateActionClosed: "dateActionClosed",
    createdDate: "createdDate",
  };
  const exportFieldTitles = {
    entityNumber: "Entity Number",
    title: "Title",
    countryName: "Country",
    regionName: "Region",
    customerSegmentName: "Customer Segment",
    znaSegmentName: "ZNA Segment",
    sbuName: "ZNA SBU",
    marketBasketName: "ZNA Market Basket",
    lobName: "LoB",
    subLOBName: "Sub LoB",
    classificationValue: "Classification",
    typeOfBreachValue: "Type Of Breach",
    rootCauseOfTheBreachValue: "Root Cause of the Breach",
    natureOfBreachValue: "Nature of Breach",
    materialBreach: "Material Breach",
    dateBreachOccurred: "Date Breach Occurred",
    breachDetails: "Breach Details",
    rangeOfFinancialImpactValue: "Range of financial impact",
    financialImpactDescription: "Financial impact description",
    howDetectedValue: "How detected",
    nearMisses: "Near Misses",
    uwrInvolved: "UWr involved",
    businessDivision: "Business Division",
    office: "office",
    policyName: "Policy name",
    policyNumber: "Policy number",
    turNumber: "UQA Review ID",
    actionResponsibleName: "Action Responsible",
    dueDate: "Due Date",
    originalDueDate: "Original Due Date",
    actionPlan: "Action Plan",
    breachStatusValue: "Breach Status",
    dateActionClosed: "Date Action Closed",
    actionUpdate: "Action Update",
    createdDate: "Created Date",
    creatorName: "Creator",
    breachLogEmailLink: "Link",
  };
  const exportHtmlFields = ["breachDetails", "actionPlan", "actionUpdate"];
  const exportCapitalField = {};
  const [commonfilterOpts, setcommonfilterOpts] = useState({
    classificationFilterOpts: [],
    groupFilterOpts: [],
    entriesFilterOpts: [
      {
        label: "My Entries",
        value: "My Entries",
      },
      {
        label: "All Entries",
        value: "All Entries",
      },
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
  const [segmentFilterOpts, setsegmentFilterOpts] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const intialFilterState = {
    entityNumber: "",
    title: "",
    classification: "",
    group: "",
    customersegment: "",
    natureofbreach: "",
    lobid: "",
    actionResponsible: "",
    entries: "",
    regionId: "",
    countryId: "",
    status: "",
    breachStatus: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const [isfilterApplied, setisfilterApplied] = useState(false);
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
    if (
      selfilter.entityNumber.trim() !== "" ||
      selfilter.title.trim() !== "" ||
      selfilter.classification !== "" ||
      selfilter.customersegment !== "" ||
      selfilter.natureofbreach !== "" ||
      selfilter.lobid !== "" ||
      selfilter.actionResponsible !== "" ||
      selfilter.regionId !== "" ||
      selfilter.countryId !== "" ||
      selfilter.breachStatus !== "" ||
      selfilter.entries !== ""
    ) {
      let dataArr;
      if (sellogTabType === "draft") {
        dataArr = logsDraftData;
      } else {
        dataArr = logstate.data;
      }
      let tempdata = [...dataArr];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.entityNumber.trim() !== "" &&
          item.entityNumber &&
          !item.entityNumber
            .toLowerCase()
            .includes(selfilter.entityNumber.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.title.trim() !== "" &&
          !item.title.toLowerCase().includes(selfilter.title.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.classification !== "" &&
          item.classification &&
          selfilter.classification !== item.classification
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.customersegment !== "" &&
          item.customerSegment &&
          selfilter.customersegment !== item.customerSegment
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.natureofbreach !== "" &&
          item.natureOfBreach &&
          item.natureOfBreach !== selfilter.natureofbreach
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.lobid !== "" &&
          item.lobid &&
          item.lobid !== selfilter.lobid
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.actionResponsible !== "" &&
          item.actionResponsible &&
          item.actionResponsible !== selfilter.actionResponsible
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.regionId !== "" &&
          item.regionId &&
          item.regionId !== selfilter.regionId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.countryId !== "" &&
          item.countryId &&
          item.countryId !== selfilter.countryId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.breachStatus !== "" &&
          item.breachStatus &&
          item.breachStatus !== selfilter.breachStatus
        ) {
          isShow = false;
        }
        if (isShow && selfilter.entries !== "") {
          if (
            selfilter.entries === "My Entries" &&
            item.createdByID !== userProfile.userId
          ) {
            isShow = false;
          }
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }

    setisfilterApplied(true);
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
    setisfilterApplied(false);
    let dataArr;
    if (sellogTabType === "draft") {
      dataArr = logsDraftData;
    } else {
      dataArr = logstate.data;
    }
    setpaginationdata(dataArr);
    // getAllBreachItems();
  };
  const checkDueDatePriority = (value) => {
    let priorityCls = "";
    let dueDate = moment(value);
    let currentDate = moment();
    let duedatediff = dueDate.diff(currentDate, "days");
    if (duedatediff > 30) {
      priorityCls = "green";
    } else if (duedatediff <= 30 && duedatediff > 1) {
      priorityCls = "amber";
    } else {
      priorityCls = "red";
    }
    return priorityCls;
  };
  //set pagination data and functionality

  //const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const [exportData, setexportData] = useState([{ columns: [], data: [] }]);

  const columns = [
    {
      dataField: "duedate-priority",
      text: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let priorityCls = checkDueDatePriority(row.dueDate);

        return (
          <div
            className={`duedate-priority-icon ${priorityCls}`}
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
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.breachLogID}
            mode={"edit"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "60px",
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
            onClick={handleEdit}
            rowid={row.breachLogID}
            mode={"view"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "60px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "",
      text: "Data Version",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="versionhistory-icon"
            onClick={() => handleDataVersion(row.breachLogID)}
            rowid={row.breachLogID}
            mode={"view"}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "100px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "entityNumber",
      text: "Entry Number",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "",
      text: "Title",
      sort: false,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let tooltiptxt = `<table><row.breachLogID`;
        return (
          <>
            <CustomToolTip
              content={
                <>
                  <table>
                    <tr>
                      <td>
                        <div className="tooltip-content">
                          <b>Breach Details</b>
                          <br></br>
                          {row.breachDetails ? parse(row.breachDetails) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Action Plan</b>
                          <br></br>
                          {row.actionPlan ? parse(row.actionPlan) : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.breachLogID}>
                {row.title}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
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
      dataField: "typeOfBreachValue",
      text: "Type of Breach",
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
      dataField: "materialBreach",
      text: "Material breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{row.materialBreach ? "Yes" : "No"}</span>;
      },
    },
    {
      dataField: "howDetectedValue",
      text: "How detected",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "originalDueDate",
      text: "Original Due Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <span>
            {row.originalDueDate
              ? formatDate(row.originalDueDate)
              : row.dueDate
              ? formatDate(row.dueDate)
              : ""}
          </span>
        );
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
      dataField: "subLOBName",
      text: "Sub-LoB",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "rootCauseOfTheBreachValue",
      text: "Root Cause of the Breach",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "dateBreachOccurred",
      text: "Date Breach Occurred",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <span>
            {row.dateBreachOccurred ? formatDate(row.dateBreachOccurred) : ""}
          </span>
        );
      },
    },
    {
      dataField: "rangeOfFinancialImpactValue",
      text: "Range of financial impact",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
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
      dataField: "actionResponsibleName",
      text: "Action Responsible",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "breachStatusValue",
      text: "Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
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
      dataField: "modifiedDate",
      text: "Modified Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "modifiedDate",
      order: "desc",
    },
  ];

  //load logs data in recurrsive
  const [logItmes, setlogItmes] = useState([]);
  const [pagesize, setpagesize] = useState(500);
  const [alllogsloaded, setalllogsloaded] = useState(false);
  const [isLoadingStarted, setisLoadingStarted] = useState(false);
  const getAllLogsInRecurssion = async () => {
    let tempItems = await getallLogs({
      RequesterUserId: userProfile.userId,
      isSubmit: true,
      PageIndex: pageIndex,
      PageSize: pagesize,
    });
    totalLogCount = tempItems.length && tempItems[0].totalCount;
    setisLoadingStarted(true);
    setlogItmes([...logItmes, ...tempItems]);
  };

  useEffect(() => {
    if (isLoadingStarted) {
      //setdata(logItmes);
      setpaginationdata(logItmes);
      let chunkPercentage = Math.round((logItmes.length / totalLogCount) * 100);
      const progressbar = document.querySelector(".progress-color");
      const progressbarcontainer = document.querySelector(
        ".progress-bar-container"
      );
      if (progressbar) {
        progressbar.style.width = chunkPercentage + "%";
      }

      if (totalLogCount > logItmes.length) {
        setlogstate({
          ...logstate,
          loading: false,
          data: [...logItmes],
        });
        pageIndex++;
        getAllLogsInRecurssion();
      } else {
        pageIndex = 1;
        totalLogCount = 0;
        setlogstate({
          ...logstate,
          loading: false,
          data: [...logItmes],
          loadedAll: true,
        });
        setalllogsloaded(true);
      }
    }
  }, [logItmes]);

  useEffect(() => {
    pageIndex = 1;
    totalLogCount = 0;
    getallDraftItems();
    getAllLogsInRecurssion();
  }, []);

  const [showDraft, setshowDraft] = useState(false);
  const [logTypes, setlogTypes] = useState([]);
  const [sellogTabType, setsellogTabType] = useState("");
  useEffect(() => {
    debugger;
    if (showDraft) {
      let tempStatus = [
        { label: "All", value: "all" },
        {
          label: "Draft",
          value: "draft",
        },
      ];
      setlogTypes(tempStatus);
      if (!sellogTabType) {
        setsellogTabType(tempStatus[0].value);
      }
    } else {
      let tempStatus = [{ label: "All", value: "all" }];
      setlogTypes(tempStatus);
      setsellogTabType(tempStatus[0].value);
    }
  }, [showDraft]);

  const getallDraftItems = async () => {
    let tempdraftItems = await getallLogs({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });
    if (tempdraftItems.length) {
      setshowDraft(true);
      setlogsDraftData([...tempdraftItems]);
    } else {
      setlogsDraftData([]);
      setshowDraft(false);
    }
  };

  const openBreachlogTab = (type) => {
    setsellogTabType(type);
  };
  useEffect(() => {
    // getAllRfeItems();
    setselfilter(intialFilterState);
    setisfilterApplied(false);
    if (sellogTabType === "draft") {
      setpaginationdata(logsDraftData);
    } else {
      setpaginationdata(logstate.data);
    }
  }, [sellogTabType, logsDraftData, logstate.data]);

  useEffect(() => {
    getAllCountry({ IsLog: true });
    getAllRegion({ IsLog: true });
    getAllSegment({ isActive: true });
    getAlllob({ isActive: true });
  }, []);

  useEffect(async () => {
    let tempActionResponsible = await getActionResponsible();
    let tempClassification = await getLookupByType({
      LookupType: "BreachClassification",
    });
    let tempNatureOfBreach = await getLookupByType({
      LookupType: "BreachNature",
    });
    let tempStatus = await getLookupByType({
      LookupType: "BreachStatus",
    });

    tempActionResponsible = tempActionResponsible.map((item) => ({
      label: item.userName,
      value: item.emailAddress,
    }));
    tempClassification = tempClassification.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempNatureOfBreach = tempNatureOfBreach.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempStatus = tempStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempActionResponsible.sort(dynamicSort("label"));
    //tempClassification.sort(dynamicSort("label"));
    tempNatureOfBreach.sort(dynamicSort("label"));
    tempStatus.sort(dynamicSort("label"));
    setcommonfilterOpts({
      ...commonfilterOpts,
      actionResponsibleFilterOpts: tempActionResponsible,
      classificationFilterOpts: tempClassification,
      natureOfBreachFilterOpts: tempNatureOfBreach,
      statusFilterOpts: tempStatus,
    });
  }, []);

  const [countrymapping, setcountrymapping] = useState([]);
  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

  useEffect(() => {
    let selectOpts = [];
    let tempCountryMapping = [];
    let tempRegionListObj = {};

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        ...item,
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
    setcountryFilterOpts([selectInitiVal, ...selectOpts]);
    setcountryAllFilterOpts([...selectOpts]);
  }, [countryState.countryItems]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    regionState.regionItems.forEach((item) => {
      selectOpts.push({
        ...item,
        label: item.regionName.trim(),
        value: item.regionID,
      });
    });
    selectOpts.sort(dynamicSort("label"));
    setfrmRegionSelectOpts([...selectOpts]);
    setregionFilterOpts([selectInitiVal, ...selectOpts]);
  }, [regionState.regionItems]);

  useEffect(() => {
    let tempItems = segmentState.segmentItems.map((item) => ({
      label: item.segmentName,
      value: item.segmentID,
      country: item.countryList,
    }));
    tempItems.sort(dynamicSort("label"));
    setsegmentFilterOpts([...tempItems]);
  }, [segmentState.segmentItems]);

  useEffect(() => {
    let tempItems = lobState.lobItems.map((item) => ({
      label: item.lobName,
      value: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setlobFilterOpts([...tempItems]);
  }, [lobState.lobItems]);
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
  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValue = {
    entityNumber: "",
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
    fullFilePath: "",
    isSubmit: false,
    UWRinvolved: "",
    BusinessDivision: "",
    Office: "",
    PolicyName: "",
    PolicyNumber: "",
    turNumber: "",
    marketBasketId: "",
    marketBasketName: "",
    znaSegmentId: "",
    znaSegmentName: "",
    znasbuId: "",
    sbuName: "",
    BreachLogEmailLink: window.location.href,
  };

  const [formIntialState, setformIntialState] = useState(formInitialValue);

  const handleEdit = async (e, hasqueryparam) => {
    let itemid;
    let mode;
    if (hasqueryparam) {
      itemid = queryparam.id;
      if (queryparam.status) {
        mode = "edit";
      } else {
        mode = "view";
      }
    } else {
      itemid = e.target.getAttribute("rowid");
      mode = e.target.getAttribute("mode");
    }
    const response = await getById({
      breachLogID: itemid,
    });
    debugger;
    if (mode === "edit" && response.isSubmit) {
      setisEditMode(true);
    }
    if (mode === "view") {
      setisReadMode(true);
    }
    if (queryparam.status) {
      response.breachStatus = queryparam.status;
    }
    setformIntialState({
      ...response,
    });
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let tempfullPathArr = item.breachAttachmentList.map(
      (item) => item.filePath
    );
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;

    let response = await postItem({
      ...item,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      alert(alertMessage.breachlog.update);
      if (queryparam.id || !logstate.loadedAll) {
        window.location = "/breachlogs";
      } else {
        setselfilter(intialFilterState);
        setisfilterApplied(false);
        //if item is submitted and in edit mode
        let tempostItem = await getallLogs({
          breachLogID: item.breachLogID,
          isSubmit: item.isSubmit,
        });
        if (item.isSubmit) {
          let isfound = false;
          for (let i = 0; i < logstate.data.length; i++) {
            let listitem = logstate.data[i];
            if (listitem.breachLogID === item.breachLogID) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate.data[i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate.data.unshift(tempostItem[0]);
          }
        } else {
          //if item is saved and in draft mode
        }
        getallDraftItems();
        hideAddPopup();
      }
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    debugger;
    let tempfullPathArr = item.breachAttachmentList.map(
      (item) => item.filePath
    );
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    let response;
    response = await postItem({
      ...item,
      createdByID: userProfile.userId,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      if (queryparam.id || !logstate.loadedAll) {
        window.location = "/breachlogs";
      } else {
        let logid = item.breachLogID ? item.breachLogID : response;
        setselfilter(intialFilterState);
        setisfilterApplied(false);
        let tempostItem = await getallLogs({
          breachLogID: logid,
          isSubmit: item.isSubmit,
        });
        if (item.isSubmit) {
          alert(alertMessage.breachlog.add);
          let isfound = false;
          for (let i = 0; i < logstate.data.length; i++) {
            let listitem = logstate.data[i];
            if (listitem.breachLogID === item.breachLogID) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate.data[i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate.data.unshift(tempostItem[0]);
          }
        } else {
          alert(alertMessage.breachlog.draft);
        }
        getallDraftItems();
        hideAddPopup();
      }
    }
  };

  const [filterbox, setfilterbox] = useState(false);
  const handleFilterBoxState = () => {
    setfilterbox(!filterbox);
  };

  //set query parameters

  const [queryparam, setqueryparam] = useState({ id: "", status: "" });
  const [queryparamloaded, setqueryparamloaded] = useState(false);
  useEffect(() => {
    setqueryparamloaded(true);
    if (queryparam.id) {
      handleEdit(this, true);
    }
  }, [queryparam]);
  useEffect(() => {
    let itemid = getUrlParameter("id");
    let status = getUrlParameter("status");
    setqueryparam({
      id: itemid,
      status: status,
    });
  }, []);

  const [showVersionHistory, setshowVersionHistory] = useState(false);
  const [versionHistoryData, setversionHistoryData] = useState([]);
  const versionHistoryexportHtmlFields = [
    "BreachDetails",
    "ActionPlan",
    "ActionUpdate",
  ];
  const versionHistoryFieldTitles = {
    EntityNumber: "Entity Number",
    Title: "Title",
    CountryName: "Country",
    RegionName: "Region",
    CustomerSegmentName: "Customer Segment",
    ZNASegmentName: "ZNA Segment",
    SBUName: "ZNA SBU",
    MarketBasketName: "ZNA Market Basket",
    LOBName: "LoB",
    SubLOBName: "Sub LoB",
    ClassificationValue: "Classification",
    TypeOfBreachValue: "Type Of Breach",
    RootCauseOfTheBreachValue: "Root Cause of the Breach",
    NatureOfBreachValue: "Nature of Breach",
    MaterialBreach: "Material Breach",
    DateBreachOccurred: "Date Breach Occurred",
    BreachDetails: "Breach Details",
    RangeOfFinancialImpactValue: "Range of financial impact",
    FinancialImpactDescription: "Financial impact description",
    HowDetectedValue: "How detected",
    NearMisses: "Near Misses",
    UWRInvolved: "UWr involved",
    BusinessDivision: "Business Division",
    Office: "office",
    PolicyName: "Policy name",
    PolicyNumber: "Policy number",
    TURNumber: "UQA Review ID",
    ActionResponsibleName: "Action Responsible",
    DueDate: "Due Date",
    OriginalDueDate: "Original Due Date",
    ActionPlan: "Action Plan",
    BreachStatusValue: "Breach Status",
    DateActionClosed: "Date Action Closed",
    ActionUpdate: "Action Update",
    CreatedDate: "Created Date",
    CreatorName: "Creator",
    BreachLogEmailLink: "Link",
  };
  const versionHistoryexportDateFields = {
    DateBreachOccurred: "dateBreachOccurred",
    DueDate: "dueDate",
    OriginalDueDate: "originalDueDate",
    DateActionClosed: "dateActionClosed",
    CreatedDate: "createdDate",
  };
  const versionHistoryExcludeFields = {
    EntityNumber: "entityNumber",
    BreachLogEmailLink: "breachLogEmailLink",
    CreatedDate: "createdDate",
    ActionResponsible: "actionResponsible",
    OriginalDueDate: "originalDueDate",
  };
  const hideVersionHistoryPopup = () => {
    setshowVersionHistory(false);
  };
  const handleDataVersion = async (itemid) => {
    let versiondata = await getDataVersion({
      TempId: itemid,
      LogType: "breachlogs",
    });
    debugger;
    setversionHistoryData(versiondata);
    setshowVersionHistory(true);

    /* //below code is to show data in new window/tab
   let strdata = `<html>
  <head>
    <title>${"Version History"}</title>
    <script
  src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
  crossorigin="anonymous"></script>
  </head>
  <script>
 function reverseorder(obj){
   if($(obj).hasClass("down-arrow")){
    $(obj).removeClass("down-arrow").addClass("up-arrow")
   }else{
    $(obj).removeClass("up-arrow").addClass("down-arrow")
   }
    $("table").each(function(elem,index){
      var arr = $.makeArray($("tbody.reversible",this).detach());
      arr.reverse();
        $(this).append(arr);
    });
}
  </script>
  <style>
  body{font-size:15px; font-family:'ZurichSans', sans-serif, Segoe UI; text-align:left;}
  table{font-size:13px;}
    table td{padding:3px; vertical-align: top;}
  .up-arrow::after {
    content:"";
        position:absolute;
    top:5px;
    left:20px;
    width: 0;
    height: 0;
    border: solid 5px transparent;
    background: transparent;
    border-bottom: solid 7px #2167ad;
    border-top-width: 0;
    cursor: pointer;
}

.down-arrow::after {
  content:"";
      position:absolute;
    top:5px;
    left:20px;
    width: 0;
    height: 0;
    border: solid 5px transparent;
    background: transparent;
    border-top: solid 7px #2167ad;
    border-bottom-width: 0;
    margin-top:1px;
    cursor: pointer;
}
  </style>
  <body style="margin: 0; padding: 5px; ">
  <div style="margin-bottom:15px;font-size:16px;color:#2167ad">Version History</div>
  <div>All Versions</div>
  <div style="padding:10px 15px;">
  <table style="width:550px">

    <tr style="position:relative;color:#2167ad">
      <th class="down-arrow"style="width:40px;text-align:left;" onclick="reverseorder(this)">No</th>
      <th style="width:300px;text-align:left;">Modified</th>
      <th style="text-align:left;" >Modified By</th>
    </tr>

  
  `;
    if (versiondata.length) {
      for (let i = versiondata.length - 1; i--; i >= 0) {
        let itemObj = versiondata[i];
        strdata += `
        <tbody  class="reversible">
      <tr >
        <td>${i + 1}</td>
        <td style="color:#2167ad">${
          itemObj["modifiedDate"] ? formatDate(itemObj["modifiedDate"]) : ""
        }</td>
        <td>${
          itemObj["lastModifiorName"] ? itemObj["lastModifiorName"] : ""
        }</td>
      </tr>
      `;
        for (let key in itemObj) {
          if (itemObj[key] && exportFieldTitles[key]) {
            strdata += `
            <tr class="linktoparent">
              <td></td>
              <td>${exportFieldTitles[key]}</td>
              <td>${
                exportDateFields[key] ? formatDate(itemObj[key]) : itemObj[key]
              }</td>
            </tr>
            
          `;
          }
        }
        strdata += `</tbody >`;
      }
    }
    strdata += `</table></div></body></html>`;
    let win = window
      .open("", "_blank", "width=600,height=400,scrollbars=yes,resizeable=yes")
      .document.write(strdata);*/
  };
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
          setInEditMode={setInEditMode}
          formIntialState={formIntialState}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmCountrySelectOpts={frmCountrySelectOpts}
          countrymapping={countrymapping}
          userProfile={userProfile}
          queryparam={queryparam}
          handleDataVersion={handleDataVersion}
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
                    selectopts={segmentFilterOpts}
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
                    selectopts={lobFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.lobid}
                  />
                </div>
                <div className="frm-filter no-margin">
                  <FrmSelect
                    title={"Action Responsible"}
                    name={"actionResponsible"}
                    selectopts={commonfilterOpts.actionResponsibleFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.actionResponsible}
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
                <div className="frm-filter">
                  <FrmSelect
                    title={"Status"}
                    name={"breachStatus"}
                    selectopts={commonfilterOpts.statusFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.breachStatus}
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
                    selfilter.breachStatus !== "" ||
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
              {isfilterApplied ? "Filters Applied" : "Filters"}
            </div>
          </div>
          <div
            className="btn-blue"
            style={{ width: "300px" }}
            onClick={() => sendLogNotification()}
          >
            Trigger Breachlog Email
          </div>
          {!alllogsloaded && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-color"></div>
              </div>
              <div className="progress-completion">Loading logs...</div>
            </div>
          )}
          <div className="tabs-container">
            {logTypes.map((item) => (
              <div
                key={item.label}
                className={`tab-btn ${
                  sellogTabType === item.value ? "selected" : "normal"
                }`}
                onClick={() => openBreachlogTab(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            {logstate.loading ? (
              <Loading />
            ) : logstate.error ? (
              <div>{logstate.error}</div>
            ) : (
              queryparamloaded &&
              !queryparam.id && (
                <PaginationData
                  id={"userId"}
                  column={columns}
                  data={paginationdata}
                  pageno={""}
                  showAddPopup={showAddPopup}
                  defaultSorted={defaultSorted}
                  isExportReport={true}
                  exportReportTitle={"Export"}
                  exportFileName={"BreachLogReport"}
                  buttonTitle={"New Breach"}
                  hidesearch={true}
                  exportExcludeFields={exportExcludeFields}
                  exportFieldTitles={exportFieldTitles}
                  exportHtmlFields={exportHtmlFields}
                  exportDateFields={exportDateFields}
                />
              )
            )}
          </div>
        </>
      )}
      {showVersionHistory ? (
        <VersionHistoryPopup
          versionHistoryData={versionHistoryData}
          hidePopup={hideVersionHistoryPopup}
          exportFieldTitles={versionHistoryFieldTitles}
          exportDateFields={versionHistoryexportDateFields}
          exportHtmlFields={versionHistoryexportHtmlFields}
          versionHistoryExcludeFields={versionHistoryExcludeFields}
          isDraft={sellogTabType === "draft" ? true : false}
        />
      ) : (
        ""
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
  getAllCount: breachlogActions.getAllCount,
  getallLogs: breachlogActions.getallLogs,
  getActionResponsible: breachlogActions.getActionResponsible,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getAllRegion: regionActions.getAllRegions,
  getAlllob: lobActions.getAlllob,
  getAllSegment: segmentActions.getAllSegment,
  getAllStatus: breachlogActions.getAllStatus,
  getById: breachlogActions.getById,
  checkIsInUse: breachlogActions.checkIsInUse,
  postItem: breachlogActions.postItem,
  deleteItem: breachlogActions.deleteItem,
  getLookupByType: lookupActions.getLookupByType,
  sendLogNotification: commonActions.sendLogNotification,
  getDataVersion: commonActions.getDataVersion,
};

export default connect(mapStateToProp, mapActions)(Breachlog);
