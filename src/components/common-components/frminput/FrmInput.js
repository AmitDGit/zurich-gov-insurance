import React from "react";
import "./Style.css";
function FrmInput(props) {
  const {
    title,
    name,
    value,
    type,
    handleChange,
    isRequired,
    isReadMode,
    validationmsg,
    issubmitted,
    handleClick,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {isReadMode ? (
        <div>{value}</div>
      ) : (
        <>
          {" "}
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            maxLength="60"
          ></input>
          {isRequired && issubmitted && !value ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(FrmInput);
