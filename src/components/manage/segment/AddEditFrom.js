import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import FrmMultiselect from "../../common-components/frmmultiselect/FrmMultiselect";
import Popup from "../../common-components/Popup";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmCountrySelectOpts,
  } = props;
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    setformfield({ ...formfield, [name]: value });
  };
  const handleMultiSelectChange = (name, value) => {
    //const tempval = value.map((item) => item.value);
    setformfield({ ...formfield, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.segmentName && formfield.countryList.length) {
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
              title={"Segment"}
              name={"segmentName"}
              value={formfield.segmentName}
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
              name={"segmentDescription"}
              value={formfield.segmentDescription}
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
