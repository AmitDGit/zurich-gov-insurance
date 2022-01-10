import React from "react";

function FrmTextArea(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>{title}</label>
      <textarea
        placeholder="Character limit 250..."
        name={name}
        value={value}
        onChange={handleChange}
        maxlength="250"
      ></textarea>
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmTextArea;
