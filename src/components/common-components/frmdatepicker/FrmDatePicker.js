import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { formatDate } from "../../../helpers";
import "./Style.css";
function FrmDatePicker(props) {
  const {
    title,
    titlelinespace,
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
    maxDate,
  } = props;

  const [startDate, setStartDate] = useState();
  useEffect(() => {
    if (value) {
      setStartDate(new Date(moment(value)));
    }
  }, [value]);

  const setChangedDate = (date) => {
    if (date) {
      handleChange(name, date);
      setStartDate(date);
    } else {
      setStartDate("");
    }
  };
  return (
    <div
      className={`frm-field ${isRequired ? "mandatory" : ""} ${
        isdisabled ? "disabled" : ""
      }`}
    >
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {titlelinespace && <br></br>}
      {isReadMode ? (
        <div>{value ? formatDate(value) : ""}</div>
      ) : (
        <DatePicker
          selected={startDate}
          onChange={(date) => setChangedDate(date)}
          disabled={isdisabled}
          minDate={minDate ? minDate : ""}
          maxDate={maxDate ? maxDate : ""}
          placeholderText="dd-mmm-yyyy"
          dateFormat="dd-MMM-yyyy"
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
