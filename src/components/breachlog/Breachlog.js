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
let pageIndex = 1;
let totalLogCount = 0;
function Breachlog({ ...props }) {
  const {
    breachlogState,
    countryState,
    regionState,
    userState,
    segmentState,
    lobState,
  } = props.state;
  const {
    getAll,
    getAllCount,
    getallLogs,
    getActionResponsible,
    getAllUsers,
    getAllCountry,
    getAllRegion,
    getAlllob,
    getAllSegment,
    getAllStatus,
    getById,
    getLookupByType,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    sendLogNotification,
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
  });
  const [logsDraftData, setlogsDraftData] = useState([]);
  //initialize filter/search functionality
  //console.log(breachlogState);
  const selectInitiVal = {
    label: "Select",
    value: "",
  };

  const openStatusValue = BREACH_LOG_STATUS.Pending;

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
    regionName: "Region",
    countryName: "Country",
    customerSegmentName: "Customer Segment",
    lobName: "LoB",
    materialBreach: "Material Breach",
    dateBreachOccurred: "Date Breach Occurred",
    nearMisses: "Near Misses",
    breachDetails: "Breach Details",
    actionResponsible: "Action Responsible",
    dueDate: "Due Date",
    originalDueDate: "Original Due Date",
    dateActionClosed: "Date Action Closed",
    createdDate: "Created Date",
    actionPlan: "Action Plan",
    actionUpdate: "Action Update",
    subLOBName: "Sub LoB",
    classificationValue: "Classification",
    typeOfBreachValue: "Type Of Breach",
    rootCauseOfTheBreachValue: "Root Cause of the Breach",
    natureOfBreachValue: "Nature of Breach",
    rangeOfFinancialImpactValue: "Range of financial impact",
    howDetectedValue: "How detected",
    breachStatusValue: "Breach Status",
    creatorName: "Creator",
    actionResponsibleName: "Action Responsible Name",
    uwrInvolved: "UWr involved",
    businessDivision: "Business Division",
    office: "office",
    policyName: "Policy name",
    policyNumber: "Policy number",
    breachLogEmailLink: "Link",
    turNumber: "UQA Review ID",
    znaSegmentName: "ZNA Segment",
    sbuName: "ZNA SBU",
    marketBasketName: "ZNA Market Basket",
  };
  const exportHtmlFields = ["breachDetails", "actionPlan", "actionUpdate"];
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

    /*let filter = {};
    if (selfilter.entityNumber !== "") {
      filter["entityNumber"] = selfilter.entityNumber;
    }
    if (selfilter.title.trim() !== "") {
      filter["title"] = selfilter.title;
    }
    if (selfilter.classification !== "") {
      filter["classification"] = selfilter.classification;
    }
    if (selfilter.customersegment !== "") {
      filter["customerSegment"] = selfilter.customersegment;
    }
    if (selfilter.natureofbreach !== "") {
      filter["natureOfBreach"] = selfilter.natureofbreach;
    }
    if (selfilter.lobid !== "") {
      filter["lobid"] = selfilter.lobid;
    }
    if (selfilter.actionResponsibleName !== "") {
      filter["actionResponsibleName"] = selfilter.actionResponsibleName;
    }
    if (selfilter.regionId !== "") {
      filter["regionId"] = selfilter.regionId;
    }
    if (selfilter.countryId !== "") {
      filter["countryId"] = selfilter.countryId;
    }
    if (selfilter.breachStatus !== "") {
      filter["breachStatus"] = selfilter.breachStatus;
    }
    if (selfilter.entries !== "") {
      if (selfilter.entries === "My Entries") {
        filter["createdByID"] = userProfile.userId;
      } else {
        filter["createdByID"] = "";
      }
    }
    getAllBreachItems(filter);*/
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
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
          width: "70px",
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
          width: "70px",
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
      setlogstate({
        ...logstate,
        loading: false,
        data: [...logItmes],
      });
      console.log("logs loaded -" + logItmes);
      let chunkPercentage = Math.round((logItmes.length / totalLogCount) * 100);
      const progressbar = document.querySelector(".progress-color");
      const progressbarcontainer = document.querySelector(
        ".progress-bar-container"
      );
      if (progressbar) {
        progressbar.style.width = chunkPercentage + "%";
      }

      if (totalLogCount > logItmes.length) {
        pageIndex++;
        getAllLogsInRecurssion();
      } else {
        pageIndex = 1;
        totalLogCount = 0;
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
    if (sellogTabType === "draft") {
      setpaginationdata(logsDraftData);
    } else {
      setpaginationdata(logstate.data);
    }
  }, [sellogTabType, logsDraftData, logstate.data]);

  const getAllBreachItems = async (filters) => {
    /* let requestParam = {
      RequesterUserId: userProfile.userId,
      isSubmit: true,
    };
    if (filters) {
      for (let key in filters) {
        requestParam[key] = filters[key];
      }
    }
    if (sellogTabType === "draft") {
      requestParam.isSubmit = false;
    }
    getAll(requestParam);

    let tempdraftcount = await getAllCount({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });

    if (tempdraftcount.length) {
      setshowDraft(true);
    } else {
      setshowDraft(false);
    }*/
    /*let tempseltype = logTypes.filter((item) => item.value === sellogTabType);
    if (tempseltype.length) {
      requestParam["breachStatus"] = tempseltype[0]["value"];
      requestParam["isSubmit"] = tempseltype[0]["isSubmit"];
      
    }*/
  };
  useEffect(() => {
    getAllCountry({ IsLog: true });
    getAllRegion({ IsLog: true });
    getAllSegment({ isActive: true });
    getAlllob({ isActive: true });
  }, []);

  /*useEffect(() => {
    let tempdata = [];

    tempdata = breachlogState.items;

    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
  }, [breachlogState.items]);*/

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
    fullFilePath: "",
    isSubmit: false,
    UWRinvolved: "",
    BusinessDivision: "",
    Office: "",
    PolicyName: "",
    PolicyNumber: "",
    turNumber: "",
    BreachLogEmailLink: window.location.href,
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
      if (queryparam.id) {
        window.location = "/breachlogs";
      } else {
        setselfilter(intialFilterState);
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
    /*if (item.breachLogID) {
      response = await postItem({
        ...item,
        modifiedByID: userProfile.userId,
      });
    } else {
      response = await postItem({
        ...item,
        createdByID: userProfile.userId,
      });
    }*/

    if (response) {
      if (queryparam.id) {
        window.location = "/breachlogs";
      } else {
        let logid = item.breachLogID ? item.breachLogID : response;
        setselfilter(intialFilterState);
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
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.breachlog.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      UserId: itemid,
    });
    if (!resonse) {
      resonse = await deleteItem({
        UserId: itemid,
      });
      if (resonse) {
        getAll({
          RequesterUserId: userProfile.userId,
        });
        alert(alertMessage.breachlog.delete);
      }
    } else {
      alert(alertMessage.breachlog.isInUse);
    }
  };

  /* search Input functionality */
  /*const [searchOptions, setsearchOptions] = useState([]);
  useEffect(() => {
    setsearchOptions(userState.approverUsers);
  }, [userState.approverUsers]);*/
  /*filter open close functions */
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
              Filters
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
};

export default connect(mapStateToProp, mapActions)(Breachlog);
