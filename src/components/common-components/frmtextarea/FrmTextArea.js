import React from "react";
import "./Style.css";
function FrmTextArea(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    isReadMode,
    validationmsg,
    issubmitted,
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
          <textarea
            placeholder="Character limit 250..."
            name={name}
            value={value}
            onChange={handleChange}
            maxLength="250"
          ></textarea>
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

export default React.memo(FrmTextArea);
