import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { formatDate } from "../../../helpers";
import "./Style.css";
function FrmDatePicker(props) {
  const {
    title,
    name,
    value,
    type,
    handleChange,
    isRequired,
    isReadMode,
    isdisabled,
    validationmsg,
    issubmitted,
    minDate,
  } = props;

  const [startDate, setStartDate] = useState();
  useEffect(() => {
    if (value) {
      setStartDate(new Date(formatDate(value)));
    }
  }, [value]);

  const setChangedDate = (date) => {
    handleChange(name, date);
    setStartDate(date);
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {isReadMode ? (
        <div>{value ? formatDate(value) : ""}</div>
      ) : (
        <DatePicker
          selected={startDate}
          onChange={(date) => setChangedDate(date)}
          disabled={isdisabled}
          minDate={minDate ? minDate : ""}
          placeholderText="mm/dd/yyyy"
          yearDropdownItemNumber={""}
          showYearDropdown
          showMonthDropdown
        />
      )}
      {isRequired && issubmitted && !value ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FrmDatePicker;
