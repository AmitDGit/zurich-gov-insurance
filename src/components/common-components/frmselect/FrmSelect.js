import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "./Style.css";
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
  const onSelect = (selectedopt) => {
    handleChange(name, selectedopt.value);
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      <div className="dropdowncls">
        <Dropdown
          options={selectopts}
          onChange={onSelect}
          value={value}
          placeholder="Select"
        />
      </div>
      {/*<select onChange={handleChange} name={name} value={value}>
        {selectopts.map((option) => (
          <option value={option.value} key={option.title}>
            {option.title}
          </option>
        ))}
        </select>*/}
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmSelect;
