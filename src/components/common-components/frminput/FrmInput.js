import React from "react";
import "./Style.css";
function FrmInput(props) {
  const {
    title,
    titlelinespace,
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
      {titlelinespace && <br></br>}
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
            maxLength="80"
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
