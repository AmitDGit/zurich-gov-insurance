import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  exemptionlogActions,
  countryActions,
  lookupActions,
  lobActions,
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
import {} from "../../constants";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
let pageIndex = 1;
let totalLogCount = 0;
function Exemptionlog({ ...props }) {
  const { exemptionlogState, countryState, lobState } = props.state;
  const {
    getAll,
    getallZUGLogs,
    getByIdZUG,
    getallZUGunderwriter,
    postItemZUG,
    getallURPMLogs,
    getByIdURPM,
    postItemURPM,
    getAllCountry,
    getLookupByType,
    checkIsInUse,
    deleteItem,
    userProfile,
  } = props;

  const [logstate, setlogstate] = useState({
    loading: true,
    error: "",
    ZUGLoadedAll: false,
    URPMLoadedAll: false,
    ZUGdata: [],
    URPMdata: [],
  });
  const [logsDraftData, setlogsDraftData] = useState({
    ZUGdraftdata: [],
    URPMdraftdata: [],
  });

  useSetNavMenu(
    { currentMenu: "Exemptionlog", isSubmenu: false },
    props.menuClick
  );
  //initialize filter/search functionality
  const selectInitiVal = {
    label: "Select",
    value: "",
  };
  const exportExcludeFieldsZUG = [
    "zugExemptionLogId",
    "fullTransitional",
    "countryID",
    "createdById",
    "isSubmit",
    "lobChapter",
    "modifiedById",
    "status",
    "totalCount",
    "typeOfBusiness",
    "typeOfExemption",
    "approver",
    "empowermentRequestedBy",
    "individualGrantedEmpowerment",
    "isActive",
  ];
  const exportExcludeFieldsURPM = [
    "urpmExemptionLogId",
    "countryID",
    "createdById",
    "isSubmit",
    "isActive",
    "globalUWStatus",
    "modifiedById",
    "totalCount",
    "section",
    "typeOfBusiness",
    "typeOfExemption",
    "globalUWApprover",
    "empowermentRequestedBy",
    "individualGrantedEmpowerment",
    "cc",
  ];
  const exportDateFields = {};
  const exportFieldTitles = {};
  const exportHtmlFields = [
    "empowermentAndFeedbackRequest",
    "additionalApprovalComments",
    "globalUWApproverComments",
    "requestDetails",
  ];
  const [commonfilterOpts, setcommonfilterOpts] = useState({
    ZUGstatusFilterOpts: [],
    URPMstatusFilterOpts: [],
    URPMSectionFilterOps: [],
    rolesFilterOpts: [
      { label: "All", value: "all" },
      { label: "Approver", value: "approver" },
      {
        label: "Initiator",
        value: "initiator",
      },
    ],
  });
  const [exemptionlogsType, setexemptionlogsType] = useState([
    {
      label: "ZUG",
      value: "zug",
    },
    {
      label: "URPM",
      value: "urpm",
    },
  ]);
  const [selectedExemptionLog, setselectedExemptionLog] = useState("zug");
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);

  const intialFilterState = {
    countryID: "",
    section: "",
    role: "",
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
    if (name === "exemptionLogType") {
      if (
        (value === "zug" && !logstate.ZUGLoadedAll) ||
        (value === "urpm" && !logstate.URPMLoadedAll)
      ) {
        setlogItmes([]);
        setlogstate({ ...logstate, loading: true });
      }
      setExemLogTypeFn(value);
    }
  };
  const handleFilterSearch = () => {
    if (
      selfilter.countryID !== "" ||
      selfilter.section !== "" ||
      selfilter.status !== "" ||
      selfilter.role !== ""
    ) {
      let dataArr;
      if (sellogTabType === "draft") {
        dataArr =
          selectedExemptionLog === "zug"
            ? logsDraftData.ZUGdraftdata
            : logsDraftData.URPMdraftdata;
      } else {
        dataArr =
          selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
      }
      let tempdata = [...dataArr];
      tempdata = tempdata.filter((item) => {
        let isShow = true;

        if (
          isShow &&
          selfilter.countryID !== "" &&
          item.countryID &&
          selfilter.countryID !== item.countryID
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.status !== "" &&
          selfilter.status !== item.status
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selectedExemptionLog === "zug" &&
          selfilter.section.trim() !== "" &&
          !item.section.toLowerCase().includes(selfilter.section.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selectedExemptionLog !== "zug" &&
          selfilter.section !== "" &&
          item.section !== selfilter.section
        ) {
          isShow = false;
        }
        if (isShow && selfilter.role !== "") {
          if (
            selfilter.role === "approver" &&
            item.approver !== userProfile.emailAddress
          ) {
            isShow = false;
          } else if (
            selfilter.role === "initiator" &&
            item.empowermentRequestedBy !== userProfile.emailAddress
          ) {
            isShow = false;
          }
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
    let dataArr;
    if (sellogTabType === "draft") {
      dataArr =
        selectedExemptionLog === "zug"
          ? logsDraftData.ZUGdraftdata
          : logsDraftData.URPMdraftdata;
    } else {
      dataArr =
        selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
    }
    setpaginationdata(dataArr);
  };

  //set pagination data and functionality

  // const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columnsZUG = [
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            onClick={handleEdit}
            rowid={row.zugExemptionLogId}
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
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let isedit = true;
        let loggeduser = userProfile.emailAddress;
        if (
          row.requestForEmpowermentCC &&
          row.underwriterGrantingEmpowerment &&
          row.requestForEmpowermentCC.indexOf(loggeduser) !== -1 &&
          row.underwriterGrantingEmpowerment.indexOf(loggeduser) < 0
        ) {
          isedit = false;
        }
        return isedit ? (
          <div
            className={`edit-icon`}
            onClick={handleEdit}
            rowid={row.zugExemptionLogId}
            mode={"edit"}
          ></div>
        ) : (
          ""
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
      dataField: "",
      text: "Entry Number",
      sort: false,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <>
            <CustomToolTip
              content={
                <>
                  <table>
                    <tr>
                      <td>
                        <div className="tooltip-content">
                          <b>Details for Request</b>
                          <br></br>
                          {row.empowermentAndFeedbackRequest
                            ? parse(row.empowermentAndFeedbackRequest)
                            : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Comments</b>
                          <br></br>
                          {row.additionalApprovalComments
                            ? parse(row.additionalApprovalComments)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.zugExemptionLogId}>
                {row.entryNumber}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    {
      dataField: "lobChapterName",
      text: "LoB Chapter / Document",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },

    {
      dataField: "section",
      text: "P&C URPM Section",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "fullTransitionalValue",
      text: "Full / Transitional",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "sectionSubject",
      text: "Section Subject",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "typeOfBusinessValue",
      text: "Type of Business",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      },
    },
    {
      dataField: "typeOfExemptionValue",
      text: "Type of exemption",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "pC_URPMExemptionRequired",
      text: "P&C URPM exemption required",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "empowermentRequestedByName",
      text: "Empowerment Requested By",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "approverName",
      text: "Approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "individualGrantedEmpowerment",
      text: "Individual Granted Empowerment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "statusValue",
      text: "Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },

    {
      dataField: "transitionalExpireDate",
      text: "Transitional Expiring Date",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "expiringDate",
      text: "Expiring Date",
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
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
  ];
  const columnsURPM = [
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            onClick={handleEdit}
            rowid={row.urpmExemptionLogId}
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
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        let isedit = true;
        let loggeduser = userProfile.emailAddress;
        if (
          row.requestForEmpowermentCC &&
          row.underwriterGrantingEmpowerment &&
          row.requestForEmpowermentCC.indexOf(loggeduser) !== -1 &&
          row.underwriterGrantingEmpowerment.indexOf(loggeduser) < 0
        ) {
          isedit = false;
        }
        return isedit ? (
          <div
            className={`edit-icon`}
            onClick={handleEdit}
            rowid={row.urpmExemptionLogId}
            mode={"edit"}
          ></div>
        ) : (
          ""
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
      dataField: "",
      text: "Entry Number",
      sort: false,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <>
            <CustomToolTip
              content={
                <>
                  <table>
                    <tr>
                      <td>
                        <div className="tooltip-content">
                          <b>Details for Request</b>
                          <br></br>
                          {row.requestDetails ? parse(row.requestDetails) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Comments</b>
                          <br></br>
                          {row.globalUWApproverComments
                            ? parse(row.globalUWApproverComments)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.urpmExemptionLogId}>
                {row.entryNumber}
              </div>
            </CustomToolTip>
          </>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "typeOfExemptionValue",
      text: "Type of exemption",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "typeOfBusinessValue",
      text: "Type of Business",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      },
    },
    {
      dataField: "sectionValue",
      text: "P&C URPM Section",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "countryName",
      text: "Country Granted Exemption",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "170px" };
      },
    },
    {
      dataField: "sectionSubject",
      text: "Section Subject / Power Reserved",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },

    {
      dataField: "creatorName",
      text: "Submitter",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "individualGrantedEmpowerment",
      text: "Individual Granted Empowerment",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      },
    },
    {
      dataField: "globalUWApproverName",
      text: "Global UW Approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "globalUWStatusValue",
      text: "Global UW Approver Status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "temporaryRequestEndDate",
      text: "End Date of Temporary Request",
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
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
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
  //set selected exemption log type
  const setExemLogTypeFn = (value) => {
    setselectedExemptionLog(value);
  };
  //load logs data in recurrsive
  const [logItmes, setlogItmes] = useState([]);
  const [pagesize, setpagesize] = useState(500);
  const [alllogsloaded, setalllogsloaded] = useState(false);
  const [isLoadingStarted, setisLoadingStarted] = useState(false);
  const getAllLogsInRecurssion = async () => {
    let tempItems = [];
    let requestParam = {
      RequesterUserId: userProfile.userId,
      isSubmit: true,
      PageIndex: pageIndex,
      PageSize: pagesize,
    };
    if (selectedExemptionLog === "zug") {
      tempItems = await getallZUGLogs(requestParam);
    } else {
      tempItems = await getallURPMLogs(requestParam);
    }
    totalLogCount = tempItems.length && tempItems[0].totalCount;
    setisLoadingStarted(true);
    setlogItmes([...logItmes, ...tempItems]);
  };

  useEffect(() => {
    if (isLoadingStarted) {
      //setdata(logItmes);
      let dataArrayName =
        selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
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
        pageIndex++;
        setlogstate({
          ...logstate,
          loading: false,
          [dataArrayName]: [...logItmes],
        });
        getAllLogsInRecurssion();
      } else {
        pageIndex = 1;
        totalLogCount = 0;
        let compeletedfieldname =
          selectedExemptionLog === "zug" ? "ZUGLoadedAll" : "URPMLoadedAll";
        setlogstate({
          ...logstate,
          loading: false,
          [dataArrayName]: [...logItmes],
          [compeletedfieldname]: true,
        });
        setalllogsloaded(true);
      }
    }
  }, [logItmes]);

  useEffect(() => {
    if (selectedExemptionLog) {
      getallDraftItems();
      let isStartLoading = false;
      if (selectedExemptionLog === "zug") {
        isStartLoading = logstate.ZUGLoadedAll ? false : true;
      } else {
        isStartLoading = logstate.URPMLoadedAll ? false : true;
      }
      if (isStartLoading) {
        pageIndex = 1;
        totalLogCount = 0;
        getAllLogsInRecurssion();
        setalllogsloaded(false);
      } else {
        let logitems =
          selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
        setpaginationdata(logitems);
      }
      let forminitval =
        selectedExemptionLog === "zug"
          ? formInitialValueZUG
          : formInitialValueURPM;
      setformIntialState(forminitval);
    }
  }, [selectedExemptionLog]);

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
    let tempdraftItems = [];
    let requestParam = {
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    };
    let draftDataArr = "";
    if (selectedExemptionLog === "zug") {
      tempdraftItems = await getallZUGLogs(requestParam);
      draftDataArr = "ZUGdraftdata";
    } else {
      tempdraftItems = await getallURPMLogs(requestParam);
      draftDataArr = "URPMdraftdata";
    }
    if (tempdraftItems.length) {
      setshowDraft(true);

      setlogsDraftData({
        ...logsDraftData,
        [draftDataArr]: [...tempdraftItems],
      });
    } else {
      setlogsDraftData({ ...logsDraftData, [draftDataArr]: [] });
      setshowDraft(false);
    }
  };

  const openlogTab = (type) => {
    setsellogTabType(type);
  };
  useEffect(() => {
    setselfilter(intialFilterState);

    if (sellogTabType === "draft") {
      let dataArr =
        selectedExemptionLog === "zug"
          ? logsDraftData.ZUGdraftdata
          : logsDraftData.URPMdraftdata;
      setpaginationdata(dataArr);
    } else {
      let dataArr =
        selectedExemptionLog === "zug" ? logstate.ZUGdata : logstate.URPMdata;
      setpaginationdata(dataArr);
    }
  }, [sellogTabType, logsDraftData, logstate]);

  useEffect(async () => {
    let tempZUGStatus = await getLookupByType({
      LookupType: "EXMPZUGStatus",
    });
    let tempURPMStatus = await getLookupByType({
      LookupType: "EXMPGlobalUWStatus",
    });
    let tempURPMSection = await getLookupByType({
      LookupType: "EXMPURPMSection",
    });
    tempZUGStatus = tempZUGStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempURPMStatus = tempURPMStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempURPMSection = tempURPMSection.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempZUGStatus.sort(dynamicSort("label"));
    tempURPMStatus.sort(dynamicSort("label"));
    tempURPMSection.sort(dynamicSort("label"));
    setcommonfilterOpts({
      ...commonfilterOpts,
      ZUGstatusFilterOpts: [selectInitiVal, ...tempZUGStatus],
      URPMstatusFilterOpts: [selectInitiVal, ...tempURPMStatus],
      URPMSectionFilterOps: [selectInitiVal, ...tempURPMSection],
    });

    setselectedExemptionLog(exemptionlogsType[0].value);
  }, []);

  const [queryparam, setqueryparam] = useState({
    id: "",
    status: "",
  });
  const [queryparamloaded, setqueryparamloaded] = useState(false);
  useEffect(() => {
    let itemid = getUrlParameter("id");
    let status = getUrlParameter("status");
    setqueryparam({ id: itemid, status: status });
  }, []);

  useEffect(() => {
    setqueryparamloaded(true);
    if (queryparam.id) {
      handleEdit(this, true);
    }
  }, [queryparam]);

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

  //get all country
  useEffect(() => {
    getAllCountry({ IsLog: true });
  }, []);

  useEffect(() => {
    let selectOpts = [];

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        label: item.countryName.trim(),
        value: item.countryID,
        regionId: item.regionID,
      });
    });
    selectOpts.sort(dynamicSort("label"));
    setfrmCountrySelectOpts([...selectOpts]);
    setcountryFilterOpts([selectInitiVal, ...selectOpts]);
  }, [countryState.countryItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    let forminitval =
      selectedExemptionLog === "zug"
        ? formInitialValueZUG
        : formInitialValueURPM;
    setformIntialState(forminitval);
    setisEditMode(false);
    setisReadMode(false);
  };
  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValueZUG = {
    countryID: "",
    countryList: [],
    typeOfExemption: "",
    typeOfBusiness: "",
    individualGrantedEmpowerment: "",
    individualGrantedEmpowermentAD: [],
    individualGrantedEmpowermentName: "",
    empowermentRequestedBy: userProfile.emailAddress,
    empowermentRequestedByName:
      userProfile.firstName + " " + userProfile.lastName,
    empowermentRequestedByAD: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.firstName + " " + userProfile.lastName,
      emailAddress: userProfile.emailAddress,
    },
    approver: "",
    approverAD: {},
    approverName: "",
    lobChapter: "",
    section: "",
    sectionSubject: "",
    empowermentAndFeedbackRequest: "",
    fullTransitional: "",
    transitionalExpireDate: null,
    expiringDate: null,
    pC_URPMExemptionRequired: false,
    additionalApprovalComments: "",
    status: "",
    exmpAttachmentList: [],
    fullFilePath: "",
    ExemptionLogType: "",
    isSubmit: false,
    exmpLogEmailLink: window.location.href,
  };
  const formInitialValueURPM = {
    countryID: "",
    countryList: [],
    typeOfExemption: "",
    typeOfBusiness: "",
    individualGrantedEmpowerment: "",
    individualGrantedEmpowermentAD: [],
    individualGrantedEmpowermentName: "",
    globalUWApprover: "",
    globalUWApproverAD: {},
    globalUWApproverName: "",
    CC: "test@test.com",
    section: "",
    sectionSubject: "",
    requestDetails: "",
    temporaryRequestEndDate: null,
    globalUWApproverComments: "",
    globalUWStatus: "",
    exmpAttachmentList: [],
    fullFilePath: "",
    isSubmit: false,
    exmpLogEmailLink: window.location.href,
  };
  const [formIntialState, setformIntialState] = useState(formInitialValueZUG);

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
    let response;
    if (selectedExemptionLog === "zug") {
      response = await getByIdZUG({
        zugExemptionLogId: itemid,
      });
    } else {
      response = await getByIdURPM({
        urpmExemptionLogId: itemid,
      });
    }
    debugger;
    if (response) {
      if (selectedExemptionLog === "zug") {
        response.approverName = response.approverAD
          ? response.approverAD.userName
          : "";
        response.empowermentRequestedByName = response.empowermentRequestedByAD
          ? response.empowermentRequestedByAD.userName
          : "";
      } else {
        response.globalUWApproverName = response.globalUWApproverAD
          ? response.globalUWApproverAD.userName
          : "";
      }
      if (
        response.individualGrantedEmpowermentAD &&
        response.individualGrantedEmpowermentAD.length
      ) {
        let users = "";
        users = response.individualGrantedEmpowermentAD.map(
          (item) => item.userName
        );
        response.individualGrantedEmpowermentName = users.join(",");
      }

      if (mode === "edit" && response.isSubmit) {
        setisEditMode(true);
      }
      if (mode === "view") {
        setisReadMode(true);
      }
      if (queryparam.status) {
        response.requestForEmpowermentStatus = queryparam.status;
      }
      setformIntialState({
        ...response,
      });
      showAddPopup();
    }
  };

  const putItemHandler = async (item) => {
    let tempfullPathArr = item.exmpAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    let response;
    let datafieldname = selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
    let id =
      selectedExemptionLog === "zug"
        ? "zugExemptionLogId"
        : "urpmExemptionLogId";

    if (selectedExemptionLog === "zug") {
      response = await postItemZUG({
        ...item,
        modifiedByID: userProfile.userId,
      });
    } else {
      response = await postItemURPM({
        ...item,
        modifiedByID: userProfile.userId,
      });
    }

    if (response) {
      alert(alertMessage.exemptionlog.update);
      /*let tpostItem = await getallLogs({
        RequesterUserId: userProfile.userId,
        rfeLogId: item.rfeLogId,
      });*/
      if (queryparam.id) {
        window.location = "/exemptionlogs";
      } else {
        setselfilter(intialFilterState);
        //if item is submitted and in edit mode
        let logid = item[id];
        let tempostItem;
        if (selectedExemptionLog === "zug") {
          tempostItem = await getallZUGLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        } else {
          tempostItem = await getallURPMLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        }
        if (item.isSubmit) {
          let isfound = false;
          for (let i = 0; i < logstate[datafieldname].length; i++) {
            let listitem = logstate[datafieldname][i];
            if (listitem[id] === item[id]) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate[datafieldname][i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate[datafieldname].unshift(tempostItem[0]);
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
    let tempfullPathArr = item.exmpAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    item.exemptionLogType = selectedExemptionLog;
    let response;
    debugger;
    let datafieldname = selectedExemptionLog === "zug" ? "ZUGdata" : "URPMdata";
    let id =
      selectedExemptionLog === "zug"
        ? "zugExemptionLogId"
        : "urpmExemptionLogId";
    let createmodfield = item[id] ? "modifiedByID" : "createdByID";
    if (selectedExemptionLog === "zug") {
      response = await postItemZUG({
        ...item,
        [createmodfield]: userProfile.userId,
      });
    } else {
      response = await postItemURPM({
        ...item,
        [createmodfield]: userProfile.userId,
      });
    }

    if (response) {
      if (queryparam.id) {
        window.location = "/exemptionlogs";
      } else {
        let logid = item[id] ? item[id] : response;
        let tempostItem;
        if (selectedExemptionLog === "zug") {
          tempostItem = await getallZUGLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        } else {
          tempostItem = await getallURPMLogs({
            [id]: logid,
            isSubmit: item.isSubmit,
          });
        }

        if (item.isSubmit) {
          alert(alertMessage.exemptionlog.add);
          let isfound = false;
          for (let i = 0; i < logstate[datafieldname].length; i++) {
            let listitem = logstate[datafieldname][i];
            if (listitem[id] === item[id]) {
              listitem = { ...listitem, ...tempostItem[0] };
              logstate[datafieldname][i] = listitem;
              isfound = true;
            }
          }
          if (!isfound) {
            logstate[datafieldname].unshift(tempostItem[0]);
          }
        } else {
          alert(alertMessage.exemptionlog.draft);
        }
        setselfilter(intialFilterState);
        //getAllRfeItems();
        getallDraftItems();
        hideAddPopup();
      }
    }
    setisEditMode(false);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.exemptionlog.deleteConfirm)) {
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
        alert(alertMessage.exemptionlog.delete);
      }
    } else {
      alert(alertMessage.exemptionlog.isInUse);
    }
  };

  const [filterbox, setfilterbox] = useState(false);
  const handleFilterBoxState = () => {
    setfilterbox(!filterbox);
  };

  return (
    <>
      {isshowAddPopup ? (
        <AddEditForm
          title={isReadMode ? "View Exemption Log" : "Add/Edit Exemption Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          formIntialState={formIntialState}
          frmCountrySelectOpts={frmCountrySelectOpts}
          userProfile={userProfile}
          setInEditMode={setInEditMode}
          queryparam={queryparam}
          selectedExemptionLog={selectedExemptionLog}
          setExemLogTypeFn={setExemLogTypeFn}
          exemptionlogsType={exemptionlogsType}
        ></AddEditForm>
      ) : (
        <>
          <div className="page-title">Exemption Log</div>
          {filterbox ? (
            <div className="page-filter collapsable">
              <div className="filter-container">
                <div className="frm-filter">
                  <FrmSelect
                    title={"Exemption Log Type"}
                    name={"exemptionLogType"}
                    selectopts={exemptionlogsType}
                    handleChange={onSearchFilterSelect}
                    value={selectedExemptionLog}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Country"}
                    name={"countryID"}
                    selectopts={countryFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.countryID}
                  />
                </div>
                <div className="frm-filter">
                  {selectedExemptionLog === "zug" ? (
                    <FrmInput
                      title={"P&C URPM Section"}
                      name={"section"}
                      type={"input"}
                      handleChange={onSearchFilterInput}
                      value={selfilter.section}
                    />
                  ) : (
                    <FrmSelect
                      title={"P&C URPM Section"}
                      name={"section"}
                      selectopts={commonfilterOpts.URPMSectionFilterOps}
                      handleChange={onSearchFilterSelect}
                      value={selfilter.section}
                    />
                  )}
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Role"}
                    name={"role"}
                    selectopts={commonfilterOpts.rolesFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.role}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"Status"}
                    name={"status"}
                    selectopts={
                      selectedExemptionLog === "zug"
                        ? commonfilterOpts.ZUGstatusFilterOpts
                        : commonfilterOpts.URPMstatusFilterOpts
                    }
                    handleChange={onSearchFilterSelect}
                    value={selfilter.status}
                  />
                </div>
              </div>
              <div className="btn-container">
                <div
                  className={`btn-blue ${
                    selfilter.countryId !== "" ||
                    selfilter.section !== "" ||
                    selfilter.role !== "" ||
                    selfilter.status !== ""
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
                onClick={() => openlogTab(item.value)}
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
              queryparamloaded && (
                <PaginationData
                  id={
                    selectedExemptionLog === "zug"
                      ? "zugExemptionLogId"
                      : "urpmExemptionLogId"
                  }
                  column={
                    selectedExemptionLog === "zug" ? columnsZUG : columnsURPM
                  }
                  data={paginationdata}
                  showAddPopup={showAddPopup}
                  defaultSorted={defaultSorted}
                  isExportReport={true}
                  exportReportTitle={"Export"}
                  exportFileName={
                    selectedExemptionLog === "zug"
                      ? "ExmptionLogCIReport"
                      : "ExmptionLogURPMReport"
                  }
                  buttonTitle={
                    selectedExemptionLog === "zug" ? "New CI" : "New URPM"
                  }
                  hidesearch={true}
                  exportExcludeFields={
                    selectedExemptionLog === "zug"
                      ? exportExcludeFieldsZUG
                      : exportExcludeFieldsURPM
                  }
                  exportDateFields={exportDateFields}
                  exportFieldTitles={exportFieldTitles}
                  exportHtmlFields={exportHtmlFields}
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
  getAll: exemptionlogActions.getAll,
  getallZUGLogs: exemptionlogActions.getallZUGLogs,
  getallZUGunderwriter: exemptionlogActions.getallZUGunderwriter,
  getByIdZUG: exemptionlogActions.getByIdZUG,
  postItemZUG: exemptionlogActions.postItemZUG,
  deleteItemZUG: exemptionlogActions.deleteItemZUG,
  getallURPMLogs: exemptionlogActions.getallURPMLogs,
  getByIdURPM: exemptionlogActions.getByIdURPM,
  postItemURPM: exemptionlogActions.postItemURPM,
  getAllCountry: countryActions.getAllCountry,
  getAlllob: lobActions.getAlllob,
  getLookupByType: lookupActions.getLookupByType,
};

export default connect(mapStateToProp, mapActions)(Exemptionlog);
