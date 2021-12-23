import React from "react";

function Dropdown(props) {
  const { label, selectopts } = props;
  return (
    <div className="dropdown-filter">
      <div className="label">{label}</div>
      <div className="dropdown">
        <select>
          {selectopts.map((option) => (
            <option value={option.value} key={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
