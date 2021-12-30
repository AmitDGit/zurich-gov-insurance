import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";
function FrmMultiselect(props) {
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

  const [selectedItems, setselectedItems] = useState(value);
  const onSelect = (selectedList, selectedItem) => {
    setselectedItems([...selectedList]);
    handleChange(name, [...selectedList]);
    console.log(selectedList);
  };
  const removeSelectedItem = (value) => {
    const tempItems = selectedItems.filter((item) => item.value != value);
    setselectedItems([...tempItems]);
    handleChange(name, [...tempItems]);
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>{title}</label>
      <Multiselect
        className="custom-multiselect"
        options={selectopts}
        displayValue="title"
        hidePlaceholder={false}
        showCheckbox={true}
        placeholder="Select"
        selectedValues={selectedItems}
        onSelect={onSelect}
      ></Multiselect>
      {isRequired && issubmitted && !selectedItems.length ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
      <div className="multi-selected-opts-container">
        {selectedItems.map((item) => (
          <div className="multi-selected-opts">
            <div>{item.title}</div>
            <div
              className="delete-icon"
              onClick={() => removeSelectedItem(item.value)}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrmMultiselect;
