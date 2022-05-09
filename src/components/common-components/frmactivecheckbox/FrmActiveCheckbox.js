import React from "react";
import "./Style.css";
function FrmActiveCheckbox(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isdisabled,
    isRequired,
    validationmsg,
    issubmitted,
  } = props;
  return (
    <div className={`frm-active-checkbox ${isRequired ? "mandatory" : ""}`}>
      <div className="active-checkbox">
        <input
          type="checkbox"
          id={`opt${name}`}
          className="regular-checkbox"
          name={name}
          checked={value}
          onChange={handleChange}
          disabled={isdisabled}
        />
        <label for={`opt${name}`}></label>
      </div>
      {title ? (
        <label
          htmlFor={name}
          className={`frmlabel ${isdisabled ? "disabled" : ""}`}
        >
          <div className="label">{title}</div>
        </label>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmActiveCheckbox;
