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
    isReadMode,
    validationmsg,
    issubmitted,
    selectopts,
  } = props;
  const onSelect = (selectedopt) => {
    handleChange(name, selectedopt.value);
  };
  const getSelectedOpt = () => {
    let selectedopt = [];
    selectedopt = selectopts.filter((item) => item.value === value);
    return selectedopt[0].label;
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {isReadMode ? (
        <div>{value ? getSelectedOpt() : ""}</div>
      ) : (
        <>
          <div className="dropdowncls">
            <Dropdown
              options={selectopts}
              onChange={onSelect}
              value={value}
              placeholder="Select"
            />
          </div>
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

export default FrmSelect;
