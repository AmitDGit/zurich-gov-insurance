import React from "react";

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
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>{title}</label>
      <div className="frm-radiobtns-container">
        {selectopts.map((option) => (
          <div className="radiobtn-container">
            <input
              type="radio"
              id={option.title}
              name={name}
              value={option.value}
              checked={value === option.value ? true : false}
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

export default FrmRadio;
