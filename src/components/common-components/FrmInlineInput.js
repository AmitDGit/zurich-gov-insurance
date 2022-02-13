import React from "react";

function FrmInlineInput(props) {
  const {
    placeholder,
    name,
    value,
    type,
    itemid,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
  } = props;
  return (
    <div className={`frm-field inlinefield ${isRequired ? "mandatory" : ""}`}>
      <input
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        maxLength="60"
        itemid={itemid}
      ></input>
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmInlineInput;
