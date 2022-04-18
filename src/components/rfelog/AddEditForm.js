import React, { useState, useEffect, useLayoutEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import Loading from "../common-components/Loading";
import moment from "moment";
import "./Style.css";
import {
  COUNTRY_ADMIN_ROLE_ID,
  RFE_LOG_ORGALINMENT_COUNTRY_ID,
  RFE_LOG_STATUS,
} from "../../constants";
import {
  userActions,
  lookupActions,
  rfelogActions,
  lobActions,
  sublobActions,
  commonActions,
  countryActions,
} from "../../actions";
import FrmRadio from "../common-components/frmradio/FrmRadio";
import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import PeoplePickerPopup from "./PeoplePickerPopup";
import Rfelocallog from "./Rfelocallog";
function AddEditForm(props) {
  const { lobState, userState, countryState } = props.state;
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isReadMode,
    isEditMode,
    setInEditMode,
    formIntialState,
    frmCountrySelectOpts,
    getAllUsers,
    getAllCountry,
    getallLocalLinks,
    getLookupByType,
    getToolTip,
    getAlllob,
    uploadFile,
    deleteFile,
    downloadFile,
    userProfile,
    queryparam,
  } = props;
  const selectInitiVal = { label: "Select", value: "" };
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [countryopts, setcountryopts] = useState([]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [isshowlocallink, setisshowlocallink] = useState(false);
  const [isstatusdisabled, setisstatusdisabled] = useState(false);
  //const [isapprovermode, setisapprovermode] = useState(false);
  const [frmLoB, setfrmLoB] = useState([]);
  const [frmorgnizationalalignment, setfrmorgnizationalalignment] = useState(
    []
  );
  const [frmrfechz, setfrmrfechz] = useState([]);
  const [frmrfeempourment, setfrmrfeempourment] = useState([]);
  const [frmstatus, setfrmstatus] = useState([]);
  const [tooltip, settooltip] = useState({});
  const organizationalAlignmentCountry = RFE_LOG_ORGALINMENT_COUNTRY_ID;
  const rfelog_status = {
    Pending: RFE_LOG_STATUS.Pending,
    More_information_needed: RFE_LOG_STATUS.More_information_needed,
    Empowerment_granted: RFE_LOG_STATUS.Empowerment_granted,
    Empowerment_granted_with_conditions:
      RFE_LOG_STATUS.Empowerment_granted_with_conditions,
    Empowerment_not_granted: RFE_LOG_STATUS.Empowerment_not_granted,
    Withdrawn: RFE_LOG_STATUS.Withdrawn,
  };
  const FileDownload = require("js-file-download");
  const [userroles, setuserroles] = useState({
    isunderwriter: false,
    isapprover: false,
    isadmin: false,
    issuperadmin: false,
    iscc: false,
  });

  const [mandatoryFields, setmandatoryFields] = useState([
    "accountName",
    "organizationalAlignment",
    "countryId",
    "lobId",
    "requestForEmpowermentReason",
    "rfeLogDetails",
    "underwriterGrantingEmpowerment",
    "requestForEmpowermentStatus",
    "receptionInformationDate",
    "responseDate",
    "underwriter",
  ]);
  const [fileuploadloader, setfileuploadloader] = useState(false);
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
    setcountryopts([selectInitiVal, ...selectOpts]);
  }, [countryState.countryItems]);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    const tempuserroles = {
      isunderwriter: false,
      isapprover: false,
      isadmin: false,
      issuperadmin: false,
      iscc: false,
    };
    if (formfield.isSubmit) {
      if (formfield.underwriter.indexOf(userProfile.emailAddress) !== -1) {
        tempuserroles.isunderwriter = true;
      }
      if (
        formfield.underwriterGrantingEmpowerment &&
        formfield.underwriterGrantingEmpowerment.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.isapprover = true;
      }
      if (
        formfield.requestForEmpowermentCC &&
        formfield.requestForEmpowermentCC.indexOf(userProfile.emailAddress) !==
          -1
      ) {
        tempuserroles.iscc = true;
      }
      if (userProfile.isAdmin) {
        tempuserroles.isadmin = true;
      }
      if (userProfile.userRoles[0].roleName === "SuperAdmin") {
        tempuserroles.issuperadmin = true;
      }
    }
    setuserroles({ ...userroles, ...tempuserroles });
  }, []);
  useEffect(async () => {
    if (userroles.isapprover || userroles.iscc) {
      getAllCountry();
    } else {
      getAllCountry({ IsLog: true });
    }
    let temporgnizationalalignment = await getLookupByType({
      LookupType: "RFEOrganizationalAlignment",
    });
    let temprfechz = await getLookupByType({
      LookupType: "RFECHZ",
    });
    let temprfeempourment = await getLookupByType({
      LookupType: "RFEEmpowermentReasonRequest",
    });
    let tempstatus = await getLookupByType({
      LookupType: "RFEEmpowermentStatusRequest",
    });
    let tempToolTips = await getToolTip({ type: "BreachLogs" });
    let tooltipObj = {};
    tempToolTips.forEach((item) => {
      tooltipObj[item.toolTipField] = item.toolTipText;
    });
    settooltip(tooltipObj);

    temporgnizationalalignment = temporgnizationalalignment.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    temprfechz = temprfechz.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    temprfeempourment = temprfeempourment.map((item) => ({
      label: item.lookUpValue,
      value: item.lookupID,
    }));
    let frmstatus = [];
    tempstatus.forEach((item) => {
      let isshow = false;
      //status pending
      if (item.lookupID === rfelog_status.Pending) {
        if (
          !formfield.isSubmit ||
          formfield.requestForEmpowermentStatus === rfelog_status.Pending
        ) {
          isshow = true;
        }
      }
      //status more information needed
      if (item.lookupID !== rfelog_status.Pending && formfield.isSubmit) {
        isshow = true;
        /* if (userroles.isapprover || userroles.issuperadmin) {
          
        }*/
      }

      if (isshow) {
        frmstatus.push({
          label: item.lookUpValue,
          value: item.lookupID,
        });
      }
    });

    setfrmorgnizationalalignment([...temporgnizationalalignment]);
    setfrmrfechz([selectInitiVal, ...temprfechz]);
    setfrmrfeempourment([selectInitiVal, ...temprfeempourment]);
    setfrmstatus([...frmstatus]);
    setloading(false);

    if (formfield.isSubmit) {
      if (userroles.isapprover || userroles.issuperadmin) {
        setisstatusdisabled(false);
      } else {
        if (!isReadMode) setisstatusdisabled(true);
      }
      if (userroles.isapprover && !userroles.issuperadmin && !isReadMode) {
        //setisapprovermode(true);
      }
      setformfield({
        ...formfield,
      });
    } else {
      setformfield({
        ...formfield,
        requestForEmpowermentStatus: rfelog_status.Pending,
      });
    }
    if (
      formfield.requestForEmpowermentStatus !== rfelog_status.Pending &&
      formfield.requestForEmpowermentStatus !==
        rfelog_status.More_information_needed &&
      formfield.isSubmit &&
      !isReadMode
    ) {
      // setisfrmdisabled(true);
    }
  }, [userroles, isEditMode]);
  const [locallinks, setlocallinks] = useState([]);
  useEffect(async () => {
    let templinks = [];
    templinks = await getallLocalLinks({});
    if (templinks.length) {
      templinks = templinks.map((item) => ({
        country: item.country,
        link: item.links,
      }));
      setlocallinks(templinks);
    }
  }, []);

  useEffect(() => {
    getAlllob({ isActive: true });
  }, []);

  useEffect(() => {
    let tempItems = lobState.lobItems.map((item) => ({
      label: item.lobName,
      value: item.lobid,
    }));
    tempItems.sort(dynamicSort("label"));
    setfrmLoB([selectInitiVal, ...tempItems]);
  }, [lobState.lobItems]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    if (
      name === "organizationalAlignment" &&
      value === organizationalAlignmentCountry
    ) {
      setisfrmdisabled(true);
      showlogPopup();
      alert(alertMessage.rfelog.orgalignmetmsg);
    } else if (
      name === "organizationalAlignment" &&
      value !== organizationalAlignmentCountry
    ) {
      setisfrmdisabled(false);
      hidelogPopup();
    }
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    setformfield({
      ...formfield,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };
  const handleDateSelectChange = (name, value) => {
    let dateval = moment(value).format("YYYY-MM-DD");
    if (
      name === "receptionInformationDate" &&
      formfield.responseDate &&
      moment(value).isAfter(formfield.responseDate)
    ) {
      setformfield({ ...formfield, [name]: dateval, responseDate: null });
    } else {
      setformfield({ ...formfield, [name]: dateval });
    }
  };
  const handleFileUpload = async (name, selectedfile) => {
    const formData = new FormData();
    if (selectedfile) {
      // Update the formData object
      for (let i = 0; i < selectedfile.length; i++) {
        let file = selectedfile[i];
        formData.append("files", file, file.name);
      }
      let folderID = formfield.rfeLogId
        ? formfield.rfeLogId
        : formfield.folderID
        ? formfield.folderID
        : "";

      formData.append("TempId", folderID);
      formData.append("LogType", "RFELogs");
    }
    setfileuploadloader(true);
    let response = await uploadFile(formData);
    if (response) {
      setfileuploadloader(false);
      if (!formfield.rfeLogId) {
        formfield.folderID = response.tempId;
      }
      let tempattachementfiles = [...formfield.rfeAttachmentList];

      response.attachmentFiles.forEach((item) => {
        let isExits = false;
        for (let j = 0; j < tempattachementfiles.length; j++) {
          let existfile = tempattachementfiles[j]["filePath"];
          existfile = existfile.split("\\")[existfile.split("\\").length - 1];
          let currentfile = item.split("\\")[item.split("\\").length - 1];
          if (existfile === currentfile) {
            isExits = true;
            break;
          }
        }
        if (!isExits) {
          tempattachementfiles.push({
            filePath: item,
            logAttachmentId: "",
            isNew: true,
          });
        }
      });
      setformfield({
        ...formfield,
        rfeAttachmentList: [...tempattachementfiles],
      });
    } else {
      setfileuploadloader(false);
      alert(alertMessage.commonmsg.fileuploaderror);
    }
  };
  const handleFileDelete = async (id, url) => {
    if (!window.confirm(alertMessage.rfelog.deleteAttachmentConfirm)) {
      return;
    }
    const requestParam = {
      id: id,
      uploadedFile: url,
    };
    const response = await deleteFile(requestParam);
    if (response) {
      alert(alertMessage.rfelog.deleteAttachment);
      let tempattachementfiles = [...formfield.rfeAttachmentList];
      tempattachementfiles = tempattachementfiles.filter(
        (item) => item.filePath !== url
      );
      setformfield({
        ...formfield,
        rfeAttachmentList: [...tempattachementfiles],
      });
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showApprover, setshowApprover] = useState(false);
  const [showCCUser, setshowCCUser] = useState(false);
  const [showUnderwriter, setshowUnderwriter] = useState(false);
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (usertype === "approver") {
      setshowApprover(true);
    } else if (usertype === "ccuser") {
      setshowCCUser(true);
    } else if (usertype === "underwriter") {
      setshowUnderwriter(true);
    }
  };
  const hidePeoplePickerPopup = () => {
    setshowApprover(false);
    setshowCCUser(false);
    setshowUnderwriter(false);
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
  };
  const assignPeoplepikerUser = (name, value, usertype) => {
    let displayname = [];
    let email = [];

    value.forEach((item) => {
      displayname.push(item.firstName + " " + item.lastName);
      email.push(item["emailAddress"]);
    });
    let namefield = "";
    let adfield = "";
    let selvalue = value;

    if (usertype === "approver") {
      namefield = "underwriterGrantingEmpowermentName";
      adfield = "underwriterGrantingEmpowermentAD";
    } else if (usertype === "ccuser") {
      namefield = "requestForEmpowermentCCName";
      adfield = "requestForEmpowermentCCAD";
    } else if (usertype === "underwriter") {
      namefield = "underwriterName";
      adfield = "underwriterAD";
      selvalue = value[0];
    }

    setformfield({
      ...formfield,
      [name]: email.join(","),
      [namefield]: displayname.join(","),
      [adfield]: selvalue,
    });
  };
  const validateform = () => {
    let isvalidated = true;
    for (let key in formfield) {
      if (mandatoryFields.includes(key) && isvalidated) {
        let value = formfield[key];
        if (key === "rfeLogDetails") {
          value = formfield[key].replace(/<\/?[^>]+(>|$)/g, "");
        }
        if (!value) {
          isvalidated = false;
        }
      }
    }
    return isvalidated;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isfrmdisabled) {
      return;
    }
    setissubmitted(true);
    if (validateform()) {
      /*formfield.underwriterAD = {
        userName: formfield.underwriterName,
        emailAddress: formfield.underwriter,
      };*/
      if (
        formfield.underwriterGrantingEmpowerment.indexOf(
          formfield.underwriter
        ) < 0
      ) {
        if (isEditMode) {
          if (
            (userroles.isadmin || userroles.isunderwriter) &&
            formfield.requestForEmpowermentStatus ===
              rfelog_status.More_information_needed
          ) {
            formfield.requestForEmpowermentStatus = rfelog_status.Pending;
          }
          putItem(formfield);
        } else {
          postItem({ ...formfield, isSubmit: true });
        }
      } else {
        alert(alertMessage.rfelog.invalidapprovermsg);
      }
    }
  };
  const handleSaveLog = () => {
    if (isfrmdisabled) {
      return;
    }
    if (formfield.accountName) {
      //setissubmitted(true);
      postItem({ ...formfield, isSubmit: false });
    } else {
      alert(alertMessage.rfelog.draftInvalid);
    }
    // }
    // hideAddPopup();
  };
  const hidePopup = () => {
    if (queryparam.id) {
      window.location = "/rfelogs";
    } else {
      hideAddPopup();
    }
  };
  const showlogPopup = () => {
    setisshowlocallink(true);
  };
  const hidelogPopup = () => {
    setisshowlocallink(false);
  };
  const downloadfile = async (fileurl) => {
    const responsedata = await downloadFile({
      uploadedFile: fileurl,
    });

    const filename = fileurl.split("/")[fileurl.split("/").length - 1];
    FileDownload(responsedata, filename);
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="header-btn-container">
          {!isEditMode && isReadMode && !userroles.iscc && (
            <div
              className="btn-blue"
              onClick={() => setInEditMode()}
              style={{ marginRight: "10px" }}
            >
              Edit
            </div>
          )}
          <div className="addedit-close btn-blue" onClick={() => hidePopup()}>
            Back
          </div>
        </div>
      </div>

      <div className="popup-formitems">
        <form onSubmit={handleSubmit} id="myForm">
          <>
            <div className="frm-field-bggray">
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Account Name"}
                    name={"accountName"}
                    value={formfield.accountName}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={true}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmRadio
                    title={"Orgnizational alignment"}
                    name={"organizationalAlignment"}
                    value={formfield.organizationalAlignment}
                    handleChange={handleChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["Classification"]}
                    issubmitted={issubmitted}
                    selectopts={frmorgnizationalalignment}
                    isdisabled={isfrmdisabled && isshowlocallink}
                  />
                </div>
                {formfield.organizationalAlignment ===
                organizationalAlignmentCountry ? (
                  <div className="col-md-3 link" onClick={showlogPopup}>
                    <ul> Local country log</ul>
                  </div>
                ) : (
                  <div className="col-md-3">
                    <FrmSelect
                      title={"Country"}
                      name={"countryId"}
                      value={formfield.countryId}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={countryopts}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                )}

                <div className="col-md-3">
                  <FrmInput
                    title={
                      <>
                        Underwriter<i>(submitter)</i>
                      </>
                    }
                    name={"underwriterName"}
                    value={formfield.underwriterName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) =>
                      handleshowpeoplepicker("underwriter", e)
                    }
                    isReadMode={isReadMode}
                    isRequired={true}
                    isdisabled={isfrmdisabled}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmSelect
                    title={<>CHZ Sustainability Desk / CHZ GI Credit Risk</>}
                    name={"chz"}
                    value={formfield.chz}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["Classification"]}
                    issubmitted={issubmitted}
                    selectopts={frmrfechz}
                    isdisabled={isfrmdisabled}
                  />
                </div>

                <div className="col-md-3">
                  <FrmSelect
                    title={<>LoB</>}
                    titlelinespace={true}
                    name={"lobId"}
                    value={formfield.lobId}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmLoB}
                    isdisabled={isfrmdisabled}
                  />
                </div>

                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Request for empowerment<br></br>reason
                      </>
                    }
                    name={"requestForEmpowermentReason"}
                    value={formfield.requestForEmpowermentReason}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmrfeempourment}
                    isdisabled={isfrmdisabled}
                  />
                </div>
              </div>
              <div className="row border-bottom">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={<>Specific Details</>}
                    name={"rfeLogDetails"}
                    value={formfield.rfeLogDetails}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
              </div>
            </div>
            <div class="frm-container-bggray">
              <div className="row">
                <div className="col-md-3">
                  <FrmInput
                    title={"Underwriter granting empowerment"}
                    name={"underwriterGrantingEmpowermentName"}
                    value={formfield.underwriterGrantingEmpowermentName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) => handleshowpeoplepicker("approver", e)}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmInput
                    title={"Request for empowerment CC"}
                    titlelinespace={true}
                    name={"requestForEmpowermentCCName"}
                    value={formfield.requestForEmpowermentCCName}
                    type={"text"}
                    handleChange={handleChange}
                    handleClick={(e) => handleshowpeoplepicker("ccuser", e)}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={
                      <>
                        Request for empowerment<br></br>status
                      </>
                    }
                    name={"requestForEmpowermentStatus"}
                    value={formfield.requestForEmpowermentStatus}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmstatus}
                    isdisabled={isfrmdisabled || isstatusdisabled}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <FrmDatePicker
                    title={
                      "Date of reception of information needed by approver"
                    }
                    name={"receptionInformationDate"}
                    value={formfield.receptionInformationDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    minDate={""}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmDatePicker
                    title={"Date of response"}
                    titlelinespace={true}
                    name={"responseDate"}
                    value={formfield.responseDate}
                    type={"date"}
                    handleChange={handleDateSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    minDate={moment(
                      formfield.receptionInformationDate
                    ).toDate()}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={isfrmdisabled}
                  />
                </div>
              </div>

              <div className="row border-bottom">
                <div className="col-md-12">
                  <FrmRichTextEditor
                    title={
                      "Underwriter granting empowerment comments / condition"
                    }
                    name={"underwriterGrantingEmpowermentComments"}
                    value={formfield.underwriterGrantingEmpowermentComments}
                    handleChange={handleSelectChange}
                    isRequired={false}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isdisabled={!isReadMode && isfrmdisabled}
                  />
                </div>
              </div>
            </div>

            <div class="">
              <div className="row ">
                <div className="col-md-6">
                  <FrmFileUpload
                    title={"Upload Attachment"}
                    name={"fullFilePath"}
                    uploadedfiles={formfield.rfeAttachmentList}
                    value={""}
                    type={""}
                    handleFileUpload={handleFileUpload}
                    handleFileDelete={handleFileDelete}
                    isRequired={false}
                    isReadMode={isReadMode}
                    isShowDelete={!isReadMode && !formfield.isSubmit}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    isshowloading={fileuploadloader ? fileuploadloader : false}
                    isdisabled={isfrmdisabled}
                    downloadfile={downloadfile}
                  />
                </div>
              </div>
            </div>
            {isEditMode || isReadMode ? (
              <div className="row mb20 border-top pt10">
                <div className="col-md-3">
                  <label>Created by</label>
                  <br></br>
                  {formfield.creatorName}
                </div>
                <div className="col-md-3">
                  <label>Created Date</label>
                  <br></br>
                  {formfield.createdDate
                    ? formatDate(formfield.createdDate)
                    : ""}
                </div>
                <div className="col-md-3">
                  <label>Modified By</label>
                  <br></br>
                  {formfield.lastModifiorName}
                </div>
                <div className="col-md-3">
                  <label>Modified Date</label>
                  <br></br>
                  {formfield.modifiedDate
                    ? formatDate(formfield.modifiedDate)
                    : ""}
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        </form>
      </div>
      {!isReadMode ? (
        <div className="popup-footer-container">
          <div className="btn-container">
            {!isEditMode ? (
              <>
                <button
                  className={`btn-blue ${isfrmdisabled && "disable"}`}
                  onClick={handleSaveLog}
                >
                  Save
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className={`btn-blue ${isfrmdisabled && "disable"}`}
              type="submit"
              form="myForm"
            >
              Submit
            </button>
            <div className={`btn-blue`} onClick={() => hidePopup()}>
              Cancel
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {isshowlocallink ? (
        <Rfelocallog
          title={"My Country Quick Links"}
          locallinks={locallinks}
          hidePopup={hidelogPopup}
        />
      ) : (
        ""
      )}
      {showApprover ? (
        <PeoplePickerPopup
          title={"Underwriter Granting Empowerment"}
          name={"underwriterGrantingEmpowerment"}
          usertype="approver"
          actionResponsible={
            formfield.underwriterGrantingEmpowerment
              ? [...formfield.underwriterGrantingEmpowermentAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          lobId={formfield.lobId}
        />
      ) : (
        ""
      )}
      {showCCUser ? (
        <PeoplePickerPopup
          title={"Empowerment CC"}
          name={"requestForEmpowermentCC"}
          usertype="ccuser"
          actionResponsible={
            formfield.requestForEmpowermentCC
              ? [...formfield.requestForEmpowermentCCAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
        />
      ) : (
        ""
      )}
      {showUnderwriter ? (
        <PeoplePickerPopup
          title={"Underwriter"}
          name={"underwriter"}
          usertype="underwriter"
          actionResponsible={
            formfield.underwriter ? [formfield.underwriterAD] : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={true}
        />
      ) : (
        ""
      )}
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAllUsers: userActions.getAllUsers,
  getLookupByType: lookupActions.getLookupByType,
  getallLocalLinks: rfelogActions.getallLocalLinks,
  getToolTip: commonActions.getToolTip,
  getAlllob: lobActions.getAlllob,
  getAllCountry: countryActions.getAllCountry,
  getAllSublob: sublobActions.getAllSublob,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  getAllUsers: userActions.getAllUsers,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
