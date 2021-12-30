import React from "react";

function FrmInput(props) {
  const {
    title,
    name,
    value,
    type,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>{title}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
      ></input>
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmInput;
