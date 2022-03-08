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
    isdisabled,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name} className={`${isdisabled ? "disabled" : ""}`}>
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
            disabled={isdisabled ? isdisabled : false}
            onChange={handleChange}
            onClick={handleClick}
            maxLength="60"
            autoComplete="off"
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
