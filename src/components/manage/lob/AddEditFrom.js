import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/FrmInput";
import FrmSelect from "../../common-components/FrmSelect";
import FrmTextArea from "../../common-components/FrmTextArea";
import FrmMultiselect from "../../common-components/FrmMultiselect";
import Popup from "../../common-components/Popup";
import { connect } from "react-redux";
import { lobActions } from "../../../actions";
import FrmInputSearch from "../../common-components/FrmInputSearch";
function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmCountrySelectOpts,
    getAllApprover,
    lobState,
  } = props;
  console.log(formIntialState);
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);
  const [selectedTab, setselectedTab] = useState("tab1");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };
  const handleApproverChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    debugger;
    setissubmitted(true);
    if (formfield.lobName && formfield.countryList.length) {
      if (isEditMode) {
        putItem(formfield);
      } else {
        postItem(formfield);
      }
    }
  };
  /* search Input functionality */

  const handleInputSearchChange = (e) => {
    const searchval = e.target.value ? e.target.value : "#$%";
    getAllApprover({ UserName: searchval });
  };
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">{title}</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="frm-tabs-container">
          <div
            className={`tab-btn ${
              selectedTab === "tab1" ? "selected" : "normal"
            }`}
            onClick={() => setselectedTab("tab1")}
          >
            Details
          </div>
          <div
            className={`tab-btn ${
              selectedTab === "tab2" ? "selected" : "normal"
            }`}
            onClick={() => setselectedTab("tab2")}
          >
            Approver
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            {selectedTab === "tab1" ? (
              <>
                <FrmInput
                  title={"LoB"}
                  name={"lobName"}
                  value={formfield.lobName}
                  type={"text"}
                  handleChange={handleChange}
                  isRequired={true}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                />
                <FrmMultiselect
                  title={"Country"}
                  name={"countryList"}
                  value={formfield.countryList}
                  handleChange={handleMultiSelectChange}
                  isRequired={true}
                  validationmsg={"Mandatory field"}
                  issubmitted={issubmitted}
                  selectopts={frmCountrySelectOpts}
                />
                <FrmTextArea
                  title={"Description"}
                  name={"lobDescription"}
                  value={formfield.lobDescription}
                  handleChange={handleChange}
                  isRequired={false}
                  validationmsg={""}
                  issubmitted={issubmitted}
                />
              </>
            ) : (
              <FrmInputSearch
                title={"Search Users"}
                name={"lobApproverList"}
                value={formfield.lobApproverList}
                type={"text"}
                handleChange={handleApproverChange}
                isRequired={false}
                validationmsg={""}
                issubmitted={issubmitted}
                handleInputSearchChange={handleInputSearchChange}
                searchItems={
                  lobState.approverUsers ? lobState.approverUsers : []
                }
                getAllApprover={getAllApprover}
              />
            )}
          </form>
        </div>
        <div className="popup-footer-container">
          <div className="btn-container">
            <button className="btn-blue" type="submit" form="myForm">
              Submit
            </button>
            <div className="btn-blue" onClick={() => hideAddPopup()}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
const mapStateToProp = (state) => {
  return {
    lobState: state.lobState,
  };
};
const mapActions = {
  getAllApprover: lobActions.getAllApprover,
};
export default connect(mapStateToProp, mapActions)(AddEditForm);
