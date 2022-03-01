import React from "react";

function FrmSelect(props) {
  const {
    title,
    name,
    value,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    selectopts,
  } = props;
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>{title}</label>
      <select onChange={handleChange} name={name} value={value}>
        {selectopts.map((option) => (
          <option value={option.value} key={option.title}>
            {option.title}
          </option>
        ))}
      </select>
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmSelect;
