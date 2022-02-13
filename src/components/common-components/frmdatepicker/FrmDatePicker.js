import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./Style.css";
function FrmDatePicker(props) {
  const {
    title,
    name,
    value,
    type,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
  } = props;
  const [startDate, setStartDate] = useState();
  useEffect(() => {
    if (value) {
      setStartDate(new Date(moment(value).format("MM/DD/YYYY")));
    }
  }, []);

  const setChangedDate = (date) => {
    handleChange(name, date);
    setStartDate(date);
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setChangedDate(date)}
      />
    </div>
  );
}

export default FrmDatePicker;
