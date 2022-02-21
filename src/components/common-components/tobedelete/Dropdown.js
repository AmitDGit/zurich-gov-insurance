import React from "react";

function Dropdown(props) {
  const { label, selectopts, onSelectHandler, initvalue, name } = props;
  console.log(selectopts);
  return (
    <div className="dropdown-filter">
      <div className="label">{label}</div>
      <div className="dropdown">
        <select onChange={onSelectHandler} name={name} value={initvalue}>
          {selectopts.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
