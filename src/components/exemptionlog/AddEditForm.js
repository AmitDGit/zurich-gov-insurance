import React, { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "react-redux";
import FrmInput from "../common-components/frminput/FrmInput";
import FrmDatePicker from "../common-components/frmdatepicker/FrmDatePicker";
import FrmSelect from "../common-components/frmselect/FrmSelect";
import FrmToggleSwitch from "../common-components/frmtoggelswitch/FrmToggleSwitch";
import FrmFileUpload from "../common-components/frmfileupload/FrmFileUpload";
import FrmMultiselect from "../common-components/frmmultiselect/FrmMultiselect";
import Loading from "../common-components/Loading";
import moment from "moment";
import "./Style.css";
import {
  EXEMPTION_ZUG_LOG_STATUS,
  EXEMPTION_URPM_LOG_STATUS,
  EXEMPTION_CONSTANT,
} from "../../constants";
import {
  userActions,
  lookupActions,
  lobchapterActions,
  commonActions,
  countryActions,
} from "../../actions";

import FrmRichTextEditor from "../common-components/frmrichtexteditor/FrmRichTextEditor";
import { alertMessage, dynamicSort, formatDate } from "../../helpers";
import PeoplePickerPopup from "./PeoplePickerPopup";

function AddEditForm(props) {
  const { lobchapterState, userState, countryState } = props.state;
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isReadMode,
    isEditMode,
    setInEditMode,
    formIntialState,
    getAllUsers,
    getAllCountry,
    getLookupByType,
    getToolTip,
    getAlllobChapter,
    uploadFile,
    deleteFile,
    downloadFile,
    userProfile,
    queryparam,
    selectedExemptionLog,
    setExemLogTypeFn,
    exemptionlogsType,
    formInitialValueURPM,
    formInitialValueZUG,
    handleDataVersion,
  } = props;
  const selectInitiVal = { label: "Select", value: "" };
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [countryopts, setcountryopts] = useState([]);
  const [isfrmdisabled, setisfrmdisabled] = useState(false);
  const [isstatusdisabled, setisstatusdisabled] = useState(false);
  const [frmLoBChapter, setfrmLoBChapter] = useState([]);
  const [frmTypeOfExemption, setfrmTypeOfExemption] = useState([]);
  const [frmTypeOfBusiness, setfrmTypeOfBusiness] = useState([]);
  const [frmFullTransitional, setfrmFullTransitional] = useState([]);
  const [frmURPMSection, setfrmURPMSection] = useState([]);
  const [frmZUGStatus, setfrmZUGStatus] = useState([]);
  const [frmURPMStatus, setfrmURPMStatus] = useState([]);
  const [frmstatus, setfrmstatus] = useState([]);
  const [tooltip, settooltip] = useState({});
  const exemption_status = {
    Pending: EXEMPTION_ZUG_LOG_STATUS.Pending,
    Empowerment_granted: EXEMPTION_ZUG_LOG_STATUS.Empowerment_granted,
    Empowerment_not_granted: EXEMPTION_ZUG_LOG_STATUS.Empowerment_not_granted,
    More_Information_Needed: EXEMPTION_ZUG_LOG_STATUS.More_Information_Needed,
    Withdrawn: EXEMPTION_ZUG_LOG_STATUS.Withdrawn,
    No_longer_required: EXEMPTION_ZUG_LOG_STATUS.No_longer_required,
  };

  const exemptionType_Individual = EXEMPTION_CONSTANT.TypeExemption_Individual;
  const exemptionType_Portfolio = EXEMPTION_CONSTANT.TypeExemption_Portfolio;
  const fullTransitional_Transitional =
    EXEMPTION_CONSTANT.FullTransitional_Transitional;
  const [userroles, setuserroles] = useState({
    issubmitter: false,
    isapprover: false,
    isadmin: false,
    issuperadmin: false,
    isgrantedempowrment: false,
    isroleloaded: false,
  });
  const FileDownload = require("js-file-download");
  const ZUGMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "lobChapter",
    "approver",
    "status",
  ];
  const URPMMandatoryFields = [
    "countryID",
    "typeOfExemption",
    "typeOfBusiness",
    "globalUWApprover",
    "globalUWStatus",
    "temporaryRequestEndDate",
  ];
  const [mandatoryFields, setmandatoryFields] = useState([]);
  const [fileuploadloader, setfileuploadloader] = useState(false);
  useEffect(() => {
    let tempopts = [];
    let selectedItems = formIntialState.countryList;
    countryState.countryItems.forEach((item) => {
      if (isEditMode) {
        let isfound = false;
        selectedItems.forEach((country) => {
          if (item.countryID === country.value) {
            isfound = true;
          }
        });
        if (item.isActive || isfound) {
          tempopts.push({
            label: item.countryName.trim(),
            value: item.countryID,
            regionId: item.regionID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.countryName.trim(),
          value: item.countryID,
          regionId: item.regionID,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setcountryopts([...tempopts]);
  }, [countryState.countryItems]);

  const [logStatus, setlogStatus] = useState({});

  const [pcurmpmopts, setpcurmpmopts] = useState([
    {
      label: "No",
      value: false,
    },
    {
      label: "Yes",
      value: true,
    },
  ]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const tempuserroles = {
      issubmitter: false,
      isapprover: false,
      isadmin: false,
      issuperadmin: false,
      isgrantedempowrment: false,
      isroleloaded: true,
    };
    if (formfield.isSubmit) {
      if (
        formfield.individualGrantedEmpowerment &&
        formfield.individualGrantedEmpowerment.indexOf(
          userProfile.emailAddress
        ) !== -1
      ) {
        tempuserroles.isgrantedempowrment = true;
      }
      if (
        (formfield.approver &&
          formfield.approver.indexOf(userProfile.emailAddress) !== -1) ||
        (formfield.globalUWApprover &&
          formfield.globalUWApprover.indexOf(userProfile.emailAddress) !== -1)
      ) {
        tempuserroles.isapprover = true;
      }
      if (
        (formfield.empowermentRequestedBy &&
          formfield.empowermentRequestedBy.indexOf(userProfile.emailAddress) !==
            -1) ||
        (formfield.submitter &&
          formfield.submitter.indexOf(userProfile.emailAddress) !== -1)
      ) {
        tempuserroles.issubmitter = true;
      }
      if (userProfile.isAdminGroup) {
        tempuserroles.isadmin = true;
      }
      if (userProfile.isSuperAdmin) {
        tempuserroles.issuperadmin = true;
      }
    }
    setuserroles({ ...userroles, ...tempuserroles });
  }, []);
  useEffect(async () => {
    if (!userroles.isroleloaded) {
      return;
    }
    if (userroles.isapprover || userroles.isgrantedempowrment) {
      getAllCountry();
    } else {
      let countrylist = await getAllCountry({ IsLog: true });
      if (userProfile.isCountryAdmin && !formfield.isSubmit) {
        countrylist = countrylist.map((item) => ({
          label: item.countryName,
          value: item.countryID,
        }));
        setformfield({
          ...formfield,
          countryList: countrylist,
        });
      }
    }
    let tempTypeOfExemption = await getLookupByType({
      LookupType: "EXMPTypeOfExemption",
    });
    let tempTypeOfBusiness = await getLookupByType({
      LookupType: "EXMPTypeOfBusiness",
    });
    let tempFullTransitional = await getLookupByType({
      LookupType: "EXMPFullTransitional",
    });
    let tempZUGStatus = await getLookupByType({
      LookupType: "EXMPZUGStatus",
    });
    let tempURPMStatus = tempZUGStatus;
    let tempURPMSection = await getLookupByType({
      LookupType: "EXMPURPMSection",
    });
    let tempToolTips = await getToolTip({ type: "ExemptionLogs" });
    let tooltipObj = {};
    tempToolTips.forEach((item) => {
      tooltipObj[item.toolTipField] = item.toolTipText;
    });
    settooltip(tooltipObj);
    let tempopts = [];
    tempTypeOfExemption.forEach((item) => {
      if (isEditMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.typeOfExemption
        ) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempTypeOfExemption = [...tempopts];
    tempopts = [];
    tempTypeOfBusiness.forEach((item) => {
      if (isEditMode) {
        if (item.isActive || item.lookupID === formIntialState.typeOfBusiness) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempTypeOfBusiness = [...tempopts];
    tempopts = [];

    tempFullTransitional.forEach((item) => {
      if (isEditMode) {
        if (
          item.isActive ||
          item.lookupID === formIntialState.fullTransitional
        ) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempFullTransitional = [...tempopts];
    tempopts = [];
    tempURPMSection = tempURPMSection.forEach((item) => {
      if (isEditMode) {
        if (item.isActive || item.lookupID === formIntialState.section) {
          tempopts.push({ label: item.lookUpValue, value: item.lookupID });
        }
      } else if (item.isActive) {
        tempopts.push({ label: item.lookUpValue, value: item.lookupID });
      }
    });
    tempURPMSection = [...tempopts];
    let frmstatus = [];
    const statusArray =
      selectedExemptionLog === "zug" ? tempZUGStatus : tempURPMStatus;
    if (selectedExemptionLog === "zug") {
      setmandatoryFields([...ZUGMandatoryFields]);
    } else {
      setmandatoryFields([...URPMMandatoryFields]);
    }
    statusArray.forEach((item) => {
      let isshow = false;
      //status pending
      if (item.lookupID === exemption_status.Pending) {
        if (
          !formfield.isSubmit ||
          formfield.status === exemption_status.Pending ||
          formfield.globalUWStatus === exemption_status.Pending
        ) {
          isshow = true;
        }
      }
      //status more information needed
      if (item.lookupID !== exemption_status.Pending && formfield.isSubmit) {
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
    tempTypeOfExemption.sort(dynamicSort("label"));
    tempTypeOfBusiness.sort(dynamicSort("label"));
    tempFullTransitional.sort(dynamicSort("label"));
    tempURPMSection.sort(dynamicSort("label"));

    setfrmTypeOfExemption([selectInitiVal, ...tempTypeOfExemption]);
    setfrmTypeOfBusiness([selectInitiVal, ...tempTypeOfBusiness]);
    setfrmFullTransitional([selectInitiVal, ...tempFullTransitional]);
    setfrmURPMSection([selectInitiVal, ...tempURPMSection]);
    setfrmZUGStatus([selectInitiVal, ...tempZUGStatus]);
    setfrmURPMStatus([selectInitiVal, ...tempURPMStatus]);

    if (frmstatus.length) {
      setfrmstatus([...frmstatus]);
    }

    setloading(false);
    //setDefaultLogStatus();
  }, [userroles, isEditMode]);

  useEffect(() => {
    if (!formfield.status) {
      return;
    }
    let tempmandatoryfields = [];
    if (formfield.status === exemption_status.No_longer_required) {
      tempmandatoryfields.push("expiringDate");
    }
    if (formfield.fullTransitional == fullTransitional_Transitional) {
      tempmandatoryfields.push("transitionalExpireDate");
    }
    setmandatoryFields([...ZUGMandatoryFields, ...tempmandatoryfields]);
  }, [formfield.status, formfield.fullTransitional]);

  useEffect(() => {
    if (frmstatus.length) {
      setDefaultLogStatus();
    }
  }, [frmstatus]);

  const setDefaultLogStatus = () => {
    if (formfield.isSubmit) {
      if (userroles.isapprover || userroles.issuperadmin) {
        setisstatusdisabled(false);
      } else if (
        userroles.isadmin ||
        userroles.issubmitter ||
        userroles.isgrantedempowrment
      ) {
        if (!isReadMode) setisstatusdisabled(true);
      }
      if (userroles.isapprover && !userroles.issuperadmin && !isReadMode) {
        //setisapprovermode(true);
      }
      setformfield({
        ...formfield,
      });
    } else {
      if (selectedExemptionLog === "zug") {
        setformfield({
          ...formfield,
          status: exemption_status.Pending,
          globalUWStatus: "",
        });
      } else {
        setformfield({
          ...formfield,
          status: "",
          globalUWStatus: exemption_status.Pending,
        });
      }
    }
  };

  useEffect(() => {
    getAlllobChapter({ isActive: true });
  }, []);

  useEffect(() => {
    let tempopts = [];

    lobchapterState.lobChapterItems.forEach((item) => {
      if (isEditMode) {
        if (item.isActive || item.lobChapterID === formIntialState.lobChapter) {
          tempopts.push({
            label: item.lobChapterName,
            value: item.lobChapterID,
          });
        }
      } else if (item.isActive) {
        tempopts.push({
          label: item.lobChapterName,
          value: item.lobChapterID,
        });
      }
    });
    tempopts.sort(dynamicSort("label"));
    setfrmLoBChapter([selectInitiVal, ...tempopts]);
  }, [lobchapterState.lobChapterItems]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
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
    if (selectedExemptionLog === "zug") {
      let fieldname = "";

      fieldname =
        name == "expiringDate" &&
        formfield.fullTransitional == fullTransitional_Transitional
          ? "transitionalExpireDate"
          : fieldname;
      fieldname =
        name == "transitionalExpireDate" &&
        formfield.status === exemption_status.No_longer_required
          ? "expiringDate"
          : fieldname;
      if (fieldname) {
        setformfield({
          ...formfield,
          [name]: dateval,
          [fieldname]: dateval,
        });
      } else {
        setformfield({ ...formfield, [name]: dateval });
      }
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
      let folderID =
        selectedExemptionLog === "zug"
          ? formfield.zugExemptionLogId
            ? formfield.zugExemptionLogId
            : formfield.folderID
            ? formfield.folderID
            : ""
          : formfield.urpmExemptionLogId
          ? formfield.urpmExemptionLogId
          : formfield.folderID
          ? formfield.folderID
          : "";

      formData.append("TempId", folderID);
      if (formfield.zugExemptionLogId) {
        formData.append("LogType", "zugLogs");
      } else {
        formData.append("LogType", "urpmLogs");
      }
    }
    setfileuploadloader(true);
    let response = await uploadFile(formData);
    if (response) {
      setfileuploadloader(false);
      if (!formfield.rfeLogId) {
        formfield.folderID = response.tempId;
      }
      let tempattachementfiles = [...formfield.exmpAttachmentList];

      response.attachmentFiles.forEach((item) => {
        let isExits = false;
        for (let j = 0; j < tempattachementfiles.length; j++) {
          let existfile = tempattachementfiles[j]["filePath"];
          existfile = existfile.split("/")[existfile.split("/").length - 1];
          let currentfile = item.split("/")[item.split("/").length - 1];
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
        exmpAttachmentList: [...tempattachementfiles],
      });
    } else {
      setfileuploadloader(false);
      alert(alertMessage.commonmsg.fileuploaderror);
    }
  };
  const handleFileDelete = async (id, url) => {
    if (!window.confirm(alertMessage.exemptionlog.deleteAttachmentConfirm)) {
      return;
    }
    const requestParam = {
      id: id,
      uploadedFile: url,
    };
    const response = await deleteFile(requestParam);
    if (response) {
      alert(alertMessage.exemptionlog.deleteAttachment);
      let tempattachementfiles = [...formfield.exmpAttachmentList];
      tempattachementfiles = tempattachementfiles.filter(
        (item) => item.filePath !== url
      );
      setformfield({
        ...formfield,
        exmpAttachmentList: [...tempattachementfiles],
      });
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [showApprover, setshowApprover] = useState(false);
  const [showempowermentRequestedBy, setshowempowermentRequestedBy] = useState(
    false
  );
  const [showGrantedEmpowerment, setshowGrantedEmpowerment] = useState(false);
  const handleshowpeoplepicker = (usertype, e) => {
    e.target.blur();
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (usertype === "approver") {
      setshowApprover(true);
    } else if (usertype === "empowermentRequestedBy") {
      setshowempowermentRequestedBy(true);
    } else if (usertype === "individualGrantedEmpowerment") {
      setshowGrantedEmpowerment(true);
    }
  };
  const hidePeoplePickerPopup = () => {
    setshowApprover(false);
    setshowempowermentRequestedBy(false);
    setshowGrantedEmpowerment(false);
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
      if (selectedExemptionLog === "zug") {
        namefield = "approverName";
        adfield = "approverAD";
      } else {
        namefield = "globalUWApproverName";
        adfield = "globalUWApproverAD";
      }
      selvalue = value[0];
    } else if (usertype === "empowermentRequestedBy") {
      namefield = "empowermentRequestedByName";
      adfield = "empowermentRequestedByAD";
      selvalue = value[0];
    } else if (usertype === "individualGrantedEmpowerment") {
      namefield = "individualGrantedEmpowermentName";
      adfield = "individualGrantedEmpowermentAD";
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
    let selectedCountryItems = formfield.countryList.map((item) => item.value);
    formfield.countryID = selectedCountryItems.join(",");

    if (validateform()) {
      /*formfield.underwriterAD = {
        userName: formfield.underwriterName,
        emailAddress: formfield.underwriter,
      };*/
      if (selectedExemptionLog === "zug") {
        let empowermentAndFeedbackRequest = formfield.empowermentAndFeedbackRequest
          ? formfield.empowermentAndFeedbackRequest.replace(
              /<\/?[^>]+(>|$)/g,
              ""
            )
          : "";
        var additionalApprovalComments = formfield.additionalApprovalComments
          ? formfield.additionalApprovalComments.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        if (!additionalApprovalComments.trim()) {
          formfield.additionalApprovalComments = "";
        }
        if (!empowermentAndFeedbackRequest.trim()) {
          formfield.empowermentAndFeedbackRequest = "";
        }
      } else {
        var globalUWApproverComments = formfield.globalUWApproverComments
          ? formfield.globalUWApproverComments.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        var requestDetails = formfield.requestDetails
          ? formfield.requestDetails.replace(/<\/?[^>]+(>|$)/g, "")
          : "";
        if (!globalUWApproverComments.trim()) {
          formfield.globalUWApproverComments = "";
        }
        if (!requestDetails.trim()) {
          formfield.requestDetails = "";
        }
      }

      let approverfieldname =
        selectedExemptionLog === "zug" ? "approver" : "globalUWApprover";
      if (
        formfield[approverfieldname].indexOf(formfield.empowermentRequestedBy) <
        0
      ) {
        if (isEditMode) {
          if (
            (userroles.isadmin || userroles.issubmitter) &&
            formfield.requestForEmpowermentStatus ===
              exemption_status.More_information_needed
          ) {
            formfield.requestForEmpowermentStatus = exemption_status.Pending;
          }
          putItem(formfield);
        } else {
          postItem({ ...formfield, isSubmit: true });
        }
      } else {
        alert(alertMessage.exemptionlog.invalidapprovermsg);
      }
    }
  };
  const handleSaveLog = () => {
    if (isfrmdisabled) {
      return;
    }
    if (formfield.countryList.length) {
      let selectedCountryItems = formfield.countryList.map(
        (item) => item.value
      );
      formfield.countryID = selectedCountryItems.join(",");
      //setissubmitted(true);
      postItem({ ...formfield, isSubmit: false });
    } else {
      alert(alertMessage.exemptionlog.draftInvalid);
    }
    // }
    // hideAddPopup();
  };
  const hidePopup = () => {
    if (queryparam.id) {
      window.location = "/exemptionlogs";
    } else {
      hideAddPopup();
    }
  };
  const downloadfile = async (fileurl) => {
    const responsedata = await downloadFile({
      uploadedFile: fileurl,
    });

    const filename = fileurl.split("/")[fileurl.split("/").length - 1];
    FileDownload(responsedata, filename);
  };
  const setExemptionlogtype = (value) => {
    setExemLogTypeFn(value);
    if (value === "zug") {
      setformfield({
        ...formInitialValueZUG,
      });
    } else {
      setformfield({
        ...formInitialValueURPM,
      });
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="addedit-logs-container">
      <div className="addedit-header-container">
        <div className="addedit-header-title">{title}</div>
        <div className="header-btn-container">
          {formfield.isSubmit && (
            <div
              className="btn-blue"
              onClick={() =>
                handleDataVersion(
                  selectedExemptionLog === "zug"
                    ? formfield.zugExemptionLogId
                    : formfield.urpmExemptionLogId
                )
              }
              style={{ marginRight: "10px" }}
            >
              Version History
            </div>
          )}
          {!isEditMode && isReadMode && (
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
      {!formfield.zugExemptionLogId && !formfield.urpmExemptionLogId && (
        <div className="tabs-container">
          {exemptionlogsType.map((item) => (
            <div
              key={item.label}
              className={`tab-btn ${
                selectedExemptionLog === item.value ? "selected" : "normal"
              }`}
              onClick={() => setExemptionlogtype(item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      <div className="popup-formitems logs-form">
        <form onSubmit={handleSubmit} id="myForm">
          <>
            <div className="frm-field-bggray">
              <div className="row">
                <div className="col-md-3">
                  <FrmMultiselect
                    title={"Country"}
                    name={"countryList"}
                    value={formfield.countryList}
                    handleChange={handleMultiSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={countryopts}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={"Type of Exemption"}
                    titlelinespace={true}
                    name={"typeOfExemption"}
                    value={formfield.typeOfExemption}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    isToolTip={true}
                    tooltipmsg={tooltip["TypeOfExemption"]}
                    issubmitted={issubmitted}
                    selectopts={frmTypeOfExemption}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                <div className="col-md-3">
                  <FrmSelect
                    title={"Type of Business"}
                    titlelinespace={true}
                    name={"typeOfBusiness"}
                    value={formfield.typeOfBusiness}
                    handleChange={handleSelectChange}
                    isRequired={true}
                    isReadMode={isReadMode}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                    selectopts={frmTypeOfBusiness}
                    isdisabled={isfrmdisabled}
                  />
                </div>
                {formfield.typeOfExemption !== exemptionType_Portfolio && (
                  <div className="col-md-3">
                    <FrmInput
                      title={
                        <>
                          Individual Granted<br></br> Empowerment
                        </>
                      }
                      name={"individualGrantedEmpowermentName"}
                      value={formfield.individualGrantedEmpowermentName}
                      type={"text"}
                      handleChange={handleChange}
                      handleClick={(e) =>
                        handleshowpeoplepicker(
                          "individualGrantedEmpowerment",
                          e
                        )
                      }
                      isReadMode={isReadMode}
                      isRequired={false}
                      isdisabled={isfrmdisabled}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                    />
                  </div>
                )}
              </div>
              <div className="row">
                {selectedExemptionLog === "zug" && (
                  <div className="col-md-3">
                    <FrmSelect
                      title={<>LoB Chapter/Document</>}
                      name={"lobChapter"}
                      value={formfield.lobChapter}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={false}
                      issubmitted={issubmitted}
                      selectopts={frmLoBChapter}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                )}

                <div className="col-md-3">
                  {selectedExemptionLog === "zug" ? (
                    <FrmInput
                      title={"Section"}
                      name={"section"}
                      value={formfield.section}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                    />
                  ) : (
                    <FrmSelect
                      title={<>Section</>}
                      name={"section"}
                      value={formfield.section}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={false}
                      issubmitted={issubmitted}
                      selectopts={frmURPMSection}
                      isdisabled={isfrmdisabled}
                    />
                  )}
                </div>

                <div
                  className={`${
                    selectedExemptionLog === "zug" ? "col-md-3" : "col-md-6"
                  }`}
                >
                  <FrmInput
                    title={"Section Subject"}
                    name={"sectionSubject"}
                    value={formfield.sectionSubject}
                    type={"text"}
                    handleChange={handleChange}
                    isReadMode={isReadMode}
                    isRequired={false}
                    validationmsg={"Mandatory field"}
                    issubmitted={issubmitted}
                  />
                </div>
                {selectedExemptionLog === "zug" ? (
                  <div className="col-md-3">
                    <FrmInput
                      title={"ZUG Chapter Version"}
                      name={"zugChapterVersion"}
                      value={formfield.zugChapterVersion}
                      type={"text"}
                      handleChange={handleChange}
                      isReadMode={isReadMode}
                      isRequired={false}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                    />
                  </div>
                ) : (
                  ""
                )}

                {selectedExemptionLog !== "zug" && (
                  <div className="col-md-3">
                    <FrmDatePicker
                      title={"End Date of Temporary Request"}
                      name={"temporaryRequestEndDate"}
                      value={formfield.temporaryRequestEndDate}
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
                )}
              </div>
              <div
                className={`row ${selectedExemptionLog !== "zug" &&
                  "border-bottom"}`}
              >
                <div className="col-md-12">
                  {selectedExemptionLog === "zug" ? (
                    <FrmRichTextEditor
                      title={"Empowerment & Feedback Request"}
                      name={"empowermentAndFeedbackRequest"}
                      value={formfield.empowermentAndFeedbackRequest}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  ) : (
                    <FrmRichTextEditor
                      title={"Details of Request"}
                      name={"requestDetails"}
                      value={formfield.requestDetails}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  )}
                </div>
              </div>
              {selectedExemptionLog === "zug" && (
                <div className="row border-bottom">
                  <div className="col-md-3">
                    <FrmInput
                      title={<>Empowerment Requested By</>}
                      titlelinespace={true}
                      name={"empowermentRequestedByName"}
                      value={formfield.empowermentRequestedByName}
                      type={"text"}
                      handleChange={handleChange}
                      handleClick={(e) =>
                        handleshowpeoplepicker("empowermentRequestedBy", e)
                      }
                      isReadMode={isReadMode}
                      isRequired={true}
                      isdisabled={isfrmdisabled}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                    />
                  </div>
                  <div className="col-md-3">
                    <FrmSelect
                      title={<>Full/Transitional</>}
                      titlelinespace={true}
                      name={"fullTransitional"}
                      value={formfield.fullTransitional}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={false}
                      issubmitted={issubmitted}
                      selectopts={frmFullTransitional}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                  {formfield.fullTransitional ==
                    fullTransitional_Transitional && (
                    <div className="col-md-3">
                      <FrmDatePicker
                        title={"Transitional Expiring Date of Empowerment"}
                        name={"transitionalExpireDate"}
                        value={formfield.transitionalExpireDate}
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
                  )}

                  <div className="col-md-3">
                    <FrmToggleSwitch
                      title={
                        <>
                          P&C URPM exemption <br></br>required
                        </>
                      }
                      name={"pC_URPMExemptionRequired"}
                      value={formfield.pC_URPMExemptionRequired}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      isToolTip={true}
                      tooltipmsg={tooltip["pC_URPMExemptionRequired"]}
                      issubmitted={issubmitted}
                      selectopts={pcurmpmopts}
                      isdisabled={isfrmdisabled}
                    />
                  </div>
                </div>
              )}
            </div>
            <div class="frm-container-bggray">
              <div className="row">
                <div className="col-md-3">
                  {selectedExemptionLog === "zug" ? (
                    <FrmInput
                      title={"Approver"}
                      name={"approverName"}
                      value={formfield.approverName}
                      type={"text"}
                      handleChange={handleChange}
                      handleClick={(e) => handleshowpeoplepicker("approver", e)}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  ) : (
                    <FrmInput
                      title={"Global UW Approver"}
                      name={"globalUWApproverName"}
                      value={formfield.globalUWApproverName}
                      type={"text"}
                      handleChange={handleChange}
                      handleClick={(e) => handleshowpeoplepicker("approver", e)}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={isfrmdisabled}
                    />
                  )}
                </div>

                <div className="col-md-3">
                  {selectedExemptionLog === "zug" ? (
                    <FrmSelect
                      title={<>Status</>}
                      name={"status"}
                      value={formfield.status}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmstatus}
                      isdisabled={isfrmdisabled || isstatusdisabled}
                    />
                  ) : (
                    <FrmSelect
                      title={<>Global UW Status</>}
                      name={"globalUWStatus"}
                      value={formfield.globalUWStatus}
                      handleChange={handleSelectChange}
                      isRequired={true}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      selectopts={frmstatus}
                      isdisabled={isfrmdisabled || isstatusdisabled}
                    />
                  )}
                </div>
                {selectedExemptionLog === "zug" &&
                  formfield.status === exemption_status.No_longer_required && (
                    <div className="col-md-3">
                      <FrmDatePicker
                        title={"Expiring Date"}
                        name={"expiringDate"}
                        value={formfield.expiringDate}
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
                  )}
              </div>

              <div className="row border-bottom">
                <div className="col-md-12">
                  {selectedExemptionLog === "zug" ? (
                    <FrmRichTextEditor
                      title={"Additional Approval Comments"}
                      name={"additionalApprovalComments"}
                      value={formfield.additionalApprovalComments}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={!isReadMode && isfrmdisabled}
                    />
                  ) : (
                    <FrmRichTextEditor
                      title={"Global UW Approver comments"}
                      name={"globalUWApproverComments"}
                      value={formfield.globalUWApproverComments}
                      handleChange={handleSelectChange}
                      isRequired={false}
                      isReadMode={isReadMode}
                      validationmsg={"Mandatory field"}
                      issubmitted={issubmitted}
                      isdisabled={!isReadMode && isfrmdisabled}
                    />
                  )}
                </div>
              </div>
            </div>

            <div class="">
              <div className="row ">
                <div className="col-md-6">
                  <FrmFileUpload
                    title={"Upload Attachment"}
                    name={"fullFilePath"}
                    uploadedfiles={formfield.exmpAttachmentList}
                    value={""}
                    type={""}
                    handleFileUpload={handleFileUpload}
                    handleFileDelete={handleFileDelete}
                    isRequired={false}
                    isReadMode={isReadMode}
                    isShowDelete={
                      (!isReadMode && !formfield.isSubmit) ||
                      (!isReadMode && userProfile.isAdminGroup)
                    }
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

      {showApprover ? (
        <PeoplePickerPopup
          title={"Approver"}
          name={
            selectedExemptionLog === "zug" ? "approver" : "globalUWApprover"
          }
          usertype="approver"
          actionResponsible={
            selectedExemptionLog === "zug"
              ? formfield.approver
                ? [formfield.approverAD]
                : []
              : formfield.globalUWApprover
              ? [formfield.globalUWApproverAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          lobChapter={formfield.lobChapter}
          singleSelection={true}
          selectedExemptionLog={selectedExemptionLog}
        />
      ) : (
        ""
      )}
      {showempowermentRequestedBy ? (
        <PeoplePickerPopup
          title={"Empowerment Requested By"}
          name={"empowermentRequestedBy"}
          usertype="empowermentRequestedBy"
          actionResponsible={
            formfield.empowermentRequestedBy
              ? [formfield.empowermentRequestedByAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={true}
        />
      ) : (
        ""
      )}
      {showGrantedEmpowerment ? (
        <PeoplePickerPopup
          title={"Individual Granted Empowerment"}
          name={"individualGrantedEmpowerment"}
          usertype="individualGrantedEmpowerment"
          actionResponsible={
            formfield.individualGrantedEmpowerment
              ? [...formfield.individualGrantedEmpowermentAD]
              : []
          }
          assignPeoplepikerUser={assignPeoplepikerUser}
          hideAddPopup={hidePeoplePickerPopup}
          singleSelection={false}
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
  getToolTip: commonActions.getToolTip,
  getAlllobChapter: lobchapterActions.getAlllobChapter,
  getAllCountry: countryActions.getAllCountry,
  uploadFile: commonActions.uploadFile,
  deleteFile: commonActions.deleteFile,
  downloadFile: commonActions.downloadFile,
  getAllUsers: userActions.getAllUsers,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
