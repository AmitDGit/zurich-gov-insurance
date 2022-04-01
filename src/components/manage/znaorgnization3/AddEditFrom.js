import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmTextArea from "../../common-components/frmtextarea/FrmTextArea";
import Popup from "../../common-components/Popup";
import { dynamicSort } from "../../../helpers";

function AddEditForm(props) {
  const {
    title,
    hideAddPopup,
    postItem,
    putItem,
    isEditMode,
    formIntialState,
    frmOrg1SelectOpts,
    frmOrg2SelectOpts,
  } = props;
  const [frmOgr2Opts, setfrmOgr2Opts] = useState(frmOrg2SelectOpts);
  const [formfield, setformfield] = useState(formIntialState);
  const [issubmitted, setissubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    if (name === "znaSegmentId") {
      setformfield({ ...formfield, znasbuId: "", [name]: value });
    } else {
      setformfield({ ...formfield, [name]: value });
    }
  };
  useEffect(() => {
    setfrmOgr2Opts(frmOrg2SelectOpts);
  }, []);

  useEffect(() => {
    if (formfield.znaSegmentId) {
      let tempopts = frmOrg2SelectOpts.filter(
        (item) => item.znaSegmentId === formfield.znaSegmentId
      );
      tempopts.sort(dynamicSort("label"));
      setfrmOgr2Opts(tempopts);
    } else {
      setfrmOgr2Opts(frmOrg2SelectOpts);
    }
  }, [formfield.znaSegmentId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.znasbuId && formfield.marketBasketName) {
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
              title={"Organization 3"}
              name={"marketBasketName"}
              value={formfield.marketBasketName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            <FrmSelect
              title={"Organization 1"}
              name={"znaSegmentId"}
              value={formfield.znaSegmentId}
              handleChange={handleSelectChange}
              isRequired={false}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmOrg1SelectOpts}
            />
            <FrmSelect
              title={"Organization 2"}
              name={"znasbuId"}
              value={formfield.znasbuId}
              handleChange={handleSelectChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmOgr2Opts}
            />
            <FrmTextArea
              title={"Description"}
              name={"description"}
              value={formfield.description}
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
