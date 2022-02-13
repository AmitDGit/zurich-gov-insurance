import React from "react";
import "./Style.css";
import ToolTip from "../tooltip/ToolTip";
function FrmRadio(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    selectopts,
    isdisabled,
    isToolTip,
    tooltipmsg,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name} className={`${isdisabled ? "disabled" : ""}`}>
        <div className="label">{title}</div>
        {isToolTip ? (
          <>
            <div className="icon info-icon" data-tip={tooltipmsg}></div>
            <ToolTip />
          </>
        ) : (
          ""
        )}
      </label>
      <div className="frm-radiobtns-container">
        {selectopts.map((option) => (
          <div className="radiobtn-container">
            <input
              type="radio"
              id={option.label}
              className="regular-radio "
              name={name}
              value={option.value}
              checked={value === option.value ? true : false}
              onChange={handleChange}
              disabled={isdisabled}
            />
            <label for={option.label}></label>
            <div className={`labeltext ${isdisabled ? "disabled" : ""}`}>
              {option.label}
            </div>
          </div>
        ))}
      </div>
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmRadio;
