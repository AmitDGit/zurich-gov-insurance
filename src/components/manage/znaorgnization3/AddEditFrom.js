import React, { useState, useEffect } from "react";
import FrmInput from "../../common-components/frminput/FrmInput";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
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
  const [frmOgr1Opts, setfrmOgr1Opts] = useState([]);
  const [frmOgr2Opts, setfrmOgr2Opts] = useState([]);
  const [frmOgr2OptsAll, setfrmOgr2OptsAll] = useState([]);
  const [formfield, setformfield] = useState({});
  const [issubmitted, setissubmitted] = useState(false);
  useEffect(() => {
    fnOnInit();
  }, []);
  const fnOnInit = () => {
    let tempotps = [];
    frmOrg1SelectOpts.forEach((item) => {
      if (isEditMode) {
        if (
          item.isActive ||
          item.znaSegmentId === formIntialState.znaSegmentId
        ) {
          tempotps.push(item);
        }
      } else if (item.isActive) {
        tempotps.push(item);
      }
    });
    setfrmOgr1Opts(tempotps);
    tempotps = [];
    frmOrg2SelectOpts.forEach((item) => {
      if (isEditMode) {
        if (item.isActive || item.znasbuId === formIntialState.znasbuId) {
          tempotps.push(item);
        }
      } else if (item.isActive) {
        tempotps.push(item);
      }
    });
    setfrmOgr2OptsAll(tempotps);
    debugger;
    if (formIntialState.znaSegmentId) {
      let tempopts = tempotps.filter(
        (item) => item.znaSegmentId === formIntialState.znaSegmentId
      );
      tempopts.sort(dynamicSort("label"));
      setfrmOgr2Opts(tempopts);
    } else {
      setfrmOgr2Opts([]);
    }
    setformfield(formIntialState);
  };
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }
    setformfield({ ...formfield, [name]: value });
  };
  const handleSelectChange = (name, value) => {
    if (name === "znaSegmentId") {
      setformfield({ ...formfield, znasbuId: "", [name]: value });
      if (value) {
        let tempopts = frmOgr2OptsAll.filter(
          (item) => item.znaSegmentId === value
        );
        tempopts.sort(dynamicSort("label"));
        setfrmOgr2Opts(tempopts);
      } else {
        setfrmOgr2Opts([]);
      }
    } else {
      setformfield({ ...formfield, [name]: value });
    }
  };

  /* useEffect(() => {
    if (formfield.znaSegmentId) {
      let tempopts = frmOgr2OptsAll.filter(
        (item) => item.znaSegmentId === formfield.znaSegmentId
      );
      tempopts.sort(dynamicSort("label"));
      setfrmOgr2Opts(tempopts);
    } else {
      setfrmOgr2Opts([]);
    }
  }, [formfield.znaSegmentId]);*/

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
              title={"ZNA Organization 3"}
              name={"marketBasketName"}
              value={formfield.marketBasketName}
              type={"text"}
              handleChange={handleChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
            />
            <FrmSelect
              title={"ZNA Organization 1"}
              name={"znaSegmentId"}
              value={formfield.znaSegmentId}
              handleChange={handleSelectChange}
              isRequired={true}
              validationmsg={"Mandatory field"}
              issubmitted={issubmitted}
              selectopts={frmOgr1Opts}
            />
            <FrmSelect
              title={"ZNA Organization 2"}
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
            <FrmActiveCheckbox
              title={"isActive"}
              name={"isActive"}
              value={formfield.isActive}
              handleChange={handleChange}
              isdisabled={!formfield.isActiveEnable}
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
