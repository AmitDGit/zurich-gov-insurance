import React from "react";

function FrmCheckbox(props) {
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
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      {title ? <label htmlFor={name}>{title}</label> : ""}
      <div className="frm-radiobtns-container">
        {selectopts.map((option) => (
          <div className="radiobtn-container">
            <input
              type="checkbox"
              id={option.title}
              name={name}
              value={option.value}
              checked={value}
              onChange={handleChange}
              disabled={isdisabled}
            />
            <div htmlFor={option.title}>{option.title}</div>
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

export default FrmCheckbox;
