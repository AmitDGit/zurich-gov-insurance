import React from "react";

function InputFilter(props) {
  const { label, onSelectHandler, initvalue, name, type } = props;
  return (
    <div className="dropdown-filter">
      <div className="label">{label}</div>
      <input
        type={type}
        name={name}
        value={initvalue}
        onChange={onSelectHandler}
      ></input>
    </div>
  );
}

export default InputFilter;
