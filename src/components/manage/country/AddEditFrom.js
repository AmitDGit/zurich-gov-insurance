import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/FrmInput";
import FrmSelect from "../../common-components/FrmSelect";
import FrmTextArea from "../../common-components/FrmTextArea";
import Popup from "../../common-components/Popup";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmRegionSelectOpts,
  } = props;

  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.regionID && formfield.countryName) {
      if (isEditMode) {
        putItem(formfield);
      } else {
        postItem(formfield);
      }
    }
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
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            <FrmInput
              title={"Country"}
              name={"countryName"}
              value={formfield.countryName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Required field"}
              issubmitted={issubmitted}
            />
            <FrmSelect
              title={"Region"}
              name={"regionID"}
              value={formfield.regionID}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Required field"}
              issubmitted={issubmitted}
              selectopts={frmRegionSelectOpts}
            />
            <FrmTextArea
              title={"Description"}
              name={"countryDescription"}
              value={formfield.countryDescription}
              handleChange={handleChange}
              isRequired={false}
              validationmsg={""}
              issubmitted={issubmitted}
            />
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

export default AddEditForm;
