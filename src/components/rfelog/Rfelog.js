import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  rfelogActions,
  countryActions,
  lookupActions,
  lobActions,
} from "../../actions";
import Loading from "../common-components/Loading";
import useSetNavMenu from "../../customhooks/useSetNavMenu";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import PaginationData from "../common-components/PaginationData";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import AddEditForm from "./AddEditForm";
import FrmInput from "../common-components/frminput/FrmInput";
import {} from "../../constants";
import CustomToolTip from "../common-components/tooltip/CustomToolTip";
import parse from "html-react-parser";
function Rfelog({ ...props }) {
  const { rfelogState, countryState, lobState } = props.state;
  const {
    getAll,
    getallCount,
    getallunderwriter,
    getAllCountry,
    getAlllob,
    getById,
    getLookupByType,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;

  //console.log(userProfile);
  //console.log(rfelogState.items);
  useSetNavMenu({ currentMenu: "Rfelog", isSubmenu: false }, props.menuClick);
  //initialize filter/search functionality
  const selectInitiVal = { label: "Select", value: "" };
  const exportExcludeFields = [
    "rfeLogId",
    "chz",
    "countryId",
    "createdById",
    "isSubmit",
    "lobId",
    "modifiedById",
    "organizationalAlignment",
    "regionId",
    "requestForEmpowermentCC",
    "requestForEmpowermentReason",
    "requestForEmpowermentStatus",
    "underwriter",
    "underwriterGrantingEmpowerment",
    "roleData",
    "isActive",
  ];
  const exportHtmlFields = [
    "rfeLogDetails",
    "underwriterGrantingEmpowermentComments",
  ];

  const [commonfilterOpts, setcommonfilterOpts] = useState({
    underwriterFilterOpts: [],
    statusFilterOpts: [],
    rolesFilterOpts: [
      { label: "All", value: "all" },
      { label: "Approver", value: "approver" },
      { label: "Empowerment CC", value: "ccuser" },
      { label: "Underwriter", value: "underwriter" },
    ],
  });
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllFilterOpts, setcountryAllFilterOpts] = useState([]);

  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const intialFilterState = {
    accountName: "",
    lobId: "",
    countryId: "",
    underwriter: "",
    role: "",
    requestForEmpowermentStatus: "",
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
    if (name === "role" && value === "underwriter") {
      setselfilter({
        ...selfilter,
        ["underwriter"]: "",
        [name]: value,
      });
    }
  };
  const handleFilterSearch = () => {
    let filter = {};
    if (selfilter.accountName.trim() !== "") {
      filter["accountName"] = selfilter.accountName;
    }
    if (selfilter.lobId !== "") {
      filter["lobId"] = selfilter.lobId;
    }
    if (selfilter.countryId !== "") {
      filter["countryId"] = selfilter.countryId;
    }
    if (selfilter.underwriter !== "") {
      filter["underwriter"] = selfilter.underwriter;
    }
    if (selfilter.requestForEmpowermentStatus !== "") {
      filter["requestForEmpowermentStatus"] =
        selfilter.requestForEmpowermentStatus;
    }
    if (selfilter.role !== "") {
      if (selfilter.role === "all") {
        filter["underwriter"] = "";
        filter["underwriterGrantingEmpowerment"] = "";
        filter["requestForEmpowermentCC"] = "";
      } else if (selfilter.role === "approver") {
        filter["underwriterGrantingEmpowerment"] = userProfile.emailAddress;
      } else if (selfilter.role === "underwriter") {
        filter["underwriter"] = userProfile.emailAddress;
      } else if (selfilter.role === "ccuser") {
        filter["requestForEmpowermentCC"] = userProfile.emailAddress;
      }
    }
    getAllRfeItems(filter);
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
    getAllRfeItems();
  };

  //set pagination data and functionality

  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columns = [
    {
      dataField: "viewaction",
      text: "View",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="view-icon"
            onClick={handleEdit}
            rowid={row.rfeLogId}
            mode={"view"}
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
            rowid={row.rfeLogId}
            mode={"edit"}
          ></div>
        ) : (
          ""
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
      dataField: "entryNumber",
      text: "Entry Number",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "120px" };
      },
    },
    {
      dataField: "",
      text: "Account Name",
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
                          <b>Details</b>
                          <br></br>
                          {row.rfeLogDetails ? parse(row.rfeLogDetails) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="tooltip-content">
                          <b>Comments</b>
                          <br></br>
                          {row.underwriterGrantingEmpowermentComments
                            ? parse(row.underwriterGrantingEmpowermentComments)
                            : ""}
                        </div>
                      </td>
                    </tr>
                  </table>
                </>
              }
              direction="right"
            >
              <div className="breach-title" rowid={row.rfeLogId}>
                {row.accountName}
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
      dataField: "organizationalAlignmentValue",
      text: "Organizational Alignment",
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
        return { width: "150px" };
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
      dataField: "underwriterName",
      text: "Underwriter",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "lobName",
      text: "LoB",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "160px" };
      },
    },
    {
      dataField: "requestForEmpowermentReasonValue",
      text: "Request for empowerment reason",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "responseDate",
      text: "Date of response",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "receptionInformationDate",
      text: "Date of reception of information needed by approver",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? formatDate(cell) : ""}</span>;
      },
    },
    {
      dataField: "requestForEmpowermentStatusValue",
      text: "Request for empowerment status",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "underwriterGrantingEmpowermentName",
      text: "Underwriter granting empowerment name",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "chzValue",
      text: "CHZ Sustainability Desk / CHZ Gi Credit Risk",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "modifiedDate",
      order: "desc",
    },
  ];

  const getAllRfeItems = async (filters) => {
    let requestParam = {
      RequesterUserId: userProfile.userId,
      isSubmit: true,
    };
    if (filters) {
      for (let key in filters) {
        requestParam[key] = filters[key];
      }
    }
    if (sellogType === "draft") {
      requestParam.isSubmit = false;
    }
    getAll(requestParam);
    let tempdraftcount = await getallCount({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });
    if (tempdraftcount.length) {
      setshowDraft(true);
    } else {
      setshowDraft(false);
    }
  };
  useEffect(() => {
    getAllCountry({ IsLog: true });
    getAlllob({ isActive: true });
  }, []);

  useEffect(() => {
    let tempdata = [];
    tempdata = rfelogState.items;
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
  }, [rfelogState.items]);

  useEffect(async () => {
    let tempStatus = await getLookupByType({
      LookupType: "RFEEmpowermentStatusRequest",
    });
    let tempUnderwritter = await getallunderwriter({
      RequesterUserId: userProfile.userId,
    });
    tempStatus = tempStatus.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    tempUnderwritter = tempUnderwritter.map((item) => ({
      label: item.userName,
      value: item.emailAddress,
    }));
    tempStatus.sort(dynamicSort("label"));
    tempUnderwritter.sort(dynamicSort("label"));
    setcommonfilterOpts({
      ...commonfilterOpts,
      statusFilterOpts: [selectInitiVal, ...tempStatus],
      underwriterFilterOpts: [selectInitiVal, ...tempUnderwritter],
    });
  }, []);

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);

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
    setcountryAllFilterOpts([...selectOpts]);
  }, [countryState.countryItems]);

  useEffect(() => {
    let tempItems = lobState.lobItems.map((item) => ({
      label: item.lobName,
      value: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setlobFilterOpts([selectInitiVal, ...tempItems]);
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
  };
  const setInEditMode = () => {
    setisEditMode(true);
    setisReadMode(false);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const [isReadMode, setisReadMode] = useState(false);
  const formInitialValue = {
    accountName: "",
    organizationalAlignment: "",
    countryId: "",
    underwriter: userProfile.emailAddress,
    underwriterName: userProfile.firstName + " " + userProfile.lastName,
    underwriterAD: {
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.firstName + " " + userProfile.lastName,
      emailAddress: userProfile.emailAddress,
    },
    chz: "",
    lobId: "",
    requestForEmpowermentReason: "",
    rfeLogDetails: "",
    underwriterGrantingEmpowerment: "",
    underwriterGrantingEmpowermentAD: [],
    underwriterGrantingEmpowermentName: "",
    requestForEmpowermentCC: "",
    requestForEmpowermentCCAD: [],
    requestForEmpowermentCCName: "",
    requestForEmpowermentStatus: "",
    rfeAttachmentList: [],
    fullFilePath: "",
    responseDate: null,
    receptionInformationDate: null,
    underwriterGrantingEmpowermentComments: "",
    rfeAttachmentList: [],
    fullFilePath: "",
    isSubmit: false,
    RFELogEmailLink: window.location.href,
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);

  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    let mode = e.target.getAttribute("mode");

    const response = await getById({ rfeLogId: itemid });
    if (response) {
      response.underwriterName = response.underwriterAD
        ? response.underwriterAD.userName
        : "";

      if (
        response.requestForEmpowermentCCAD &&
        response.requestForEmpowermentCCAD.length
      ) {
        let users = "";
        users = response.requestForEmpowermentCCAD.map((item) => item.userName);
        response.requestForEmpowermentCCName = users.join(",");
      }
      if (
        response.underwriterGrantingEmpowermentAD &&
        response.underwriterGrantingEmpowermentAD.length
      ) {
        let users = "";
        users = response.underwriterGrantingEmpowermentAD.map(
          (item) => item.userName
        );
        response.underwriterGrantingEmpowermentName = users.join(",");
      }
      if (mode === "edit" && response.isSubmit) {
        setisEditMode(true);
      }
      if (mode === "view") {
        setisReadMode(true);
      }
      setformIntialState({
        ...response,
      });
      showAddPopup();
    }
  };

  const putItemHandler = async (item) => {
    let tempfullPathArr = item.rfeAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    item.RFELogEmailLink = window.location.href + "?id=" + item.rfeLogId;
    let response = await postItem({
      ...item,
      modifiedByID: userProfile.userId,
    });
    if (response) {
      setselfilter(intialFilterState);
      getAllRfeItems();
      hideAddPopup();
      alert(alertMessage.rfelog.update);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let tempfullPathArr = item.rfeAttachmentList.map((item) => item.filePath);
    let fullFilePath = tempfullPathArr.join(",");
    item.fullFilePath = fullFilePath;
    let response;

    if (item.rfeLogId) {
      item.RFELogEmailLink = window.location.href + "?id=" + item.rfeLogId;
      response = await postItem({
        ...item,
        modifiedByID: userProfile.userId,
      });
    } else {
      response = await postItem({
        ...item,
        createdByID: userProfile.userId,
      });
    }
    if (response) {
      setselfilter(intialFilterState);
      getAllRfeItems();
      hideAddPopup();
      if (item.isSubmit) {
        alert(alertMessage.rfelog.add);
      } else {
        alert(alertMessage.rfelog.draft);
      }
    }
    setisEditMode(false);
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.rfelog.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ UserId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ UserId: itemid });
      if (resonse) {
        getAll({ RequesterUserId: userProfile.userId });
        alert(alertMessage.rfelog.delete);
      }
    } else {
      alert(alertMessage.rfelog.isInUse);
    }
  };

  const [filterbox, setfilterbox] = useState(false);
  const handleFilterBoxState = () => {
    setfilterbox(!filterbox);
  };
  const [showDraft, setshowDraft] = useState(false);
  const [logTypes, setlogTypes] = useState([]);
  const [sellogType, setsellogType] = useState("");

  useEffect(async () => {
    let tempStatus = [{ label: "All", value: "all" }];
    setlogTypes(tempStatus);
    setsellogType(tempStatus[0].value);
  }, []);
  /*useEffect(async () => {
    let tempdraftcount = await getallCount({
      RequesterUserId: userProfile.userId,
      isSubmit: false,
    });
    if (tempdraftcount.length) {
      setshowDraft(true);
    } else {
      setshowDraft(false);
    }
  }, []);*/

  useEffect(() => {
    if (showDraft) {
      let tempStatus = [
        { label: "All", value: "all" },
        { label: "Draft", value: "draft", isSubmit: false },
      ];
      setlogTypes(tempStatus);
    } else {
      let tempStatus = [{ label: "All", value: "all" }];
      setlogTypes(tempStatus);
      setsellogType(tempStatus[0].value);
    }
  }, [showDraft]);

  const openlogTab = (type) => {
    setsellogType(type);
  };
  useEffect(() => {
    getAllRfeItems();
    setselfilter(intialFilterState);
  }, [sellogType]);

  return (
    <>
      {isshowAddPopup ? (
        <AddEditForm
          title={isReadMode ? "View RfE Log" : "Add/Edit RfE Log"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          isReadMode={isReadMode}
          formIntialState={formIntialState}
          frmCountrySelectOpts={frmCountrySelectOpts}
          userProfile={userProfile}
          setInEditMode={setInEditMode}
        ></AddEditForm>
      ) : (
        <>
          <div className="page-title">RfE Log</div>
          {filterbox ? (
            <div className="page-filter collapsable">
              <div className="filter-container">
                <div className="frm-filter">
                  <FrmInput
                    title={"Account"}
                    name={"accountName"}
                    type={"input"}
                    handleChange={onSearchFilterInput}
                    value={selfilter.accountName}
                  />
                </div>
                <div className="frm-filter">
                  <FrmSelect
                    title={"LoB"}
                    name={"lobId"}
                    selectopts={lobFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.lobId}
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
                    title={
                      <>
                        Underwriter <i>(submitter)</i>
                      </>
                    }
                    name={"underwriter"}
                    selectopts={commonfilterOpts.underwriterFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.underwriter}
                  />
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
                    name={"requestForEmpowermentStatus"}
                    selectopts={commonfilterOpts.statusFilterOpts}
                    handleChange={onSearchFilterSelect}
                    value={selfilter.requestForEmpowermentStatus}
                  />
                </div>
              </div>
              <div className="btn-container">
                <div
                  className={`btn-blue ${
                    selfilter.accountName !== "" ||
                    selfilter.lobId !== "" ||
                    selfilter.countryId !== "" ||
                    selfilter.underwriter !== "" ||
                    selfilter.role !== "" ||
                    selfilter.requestForEmpowermentStatus !== ""
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
                key={item.label}
                className={`tab-btn ${
                  sellogType === item.value ? "selected" : "normal"
                }`}
                onClick={() => openlogTab(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            {rfelogState.loading ? (
              <Loading />
            ) : rfelogState.error ? (
              <div>{rfelogState.error}</div>
            ) : (
              <PaginationData
                id={"rfeLogId"}
                column={columns}
                data={paginationdata}
                showAddPopup={showAddPopup}
                defaultSorted={defaultSorted}
                isExportReport={true}
                exportReportTitle={"Export"}
                exportFileName={"RFELogReport"}
                buttonTitle={"New RfE"}
                hidesearch={true}
                exportExcludeFields={exportExcludeFields}
                exportHtmlFields={exportHtmlFields}
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
  getAll: rfelogActions.getAll,
  getallCount: rfelogActions.getallCount,
  getAllCountry: countryActions.getAllCountry,
  getAlllob: lobActions.getAlllob,
  getById: rfelogActions.getById,
  postItem: rfelogActions.postItem,
  deleteItem: rfelogActions.deleteItem,
  getallunderwriter: rfelogActions.getallunderwriter,
  getLookupByType: lookupActions.getLookupByType,
};

export default connect(mapStateToProp, mapActions)(Rfelog);
