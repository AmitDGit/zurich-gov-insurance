import React, { useState } from "react";
import Popup from "../../common-components/Popup";
import Multiselect from "multiselect-react-dropdown";
function AddEditSegmentForm(props) {
  const { hideAddPopup, postItems } = props;
  const intialState = {
    segment: "",
    country: "",
    description: "",
  };
  const [formfield, setformfield] = useState(intialState);
  const [issubmitted, setissubmitted] = useState(false);
  //multiselect options
  const data = [
    { country: "India", id: 1 },
    { country: "US", id: 2 },
    { country: "England", id: 3 },
    { country: "Swich", id: 4 },
  ];
  const [Options, setstate] = useState(data);
  const [selectedItems, setselectedItems] = useState([
    { country: "US", id: 2 },
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformfield({ ...formfield, [name]: value });
  };
  //mutiselect fns
  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    setselectedItems([...selectedList]);
  };
  const removeSelectedItem = (id) => {
    console.log(id);
    const tempItems = selectedItems.filter((item) => item.id != id);
    console.log(tempItems);
    setselectedItems([...tempItems]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setissubmitted(true);
    if (formfield.region) {
      postItems(formfield);
    }
    hideAddPopup();
  };
  return (
    <Popup {...props}>
      <div className="popup-box">
        <div className="popup-header-container">
          <div className="popup-header-title">Add/Edit Segment</div>
          <div className="popup-close" onClick={() => hideAddPopup()}>
            X
          </div>
        </div>
        <div className="popup-formitems">
          <form onSubmit={handleSubmit} id="myForm">
            <div className="frm-field mandatory">
              <label htmlFor="segment">Segment</label>
              <input
                type="text"
                name="segment"
                value={formfield.segment}
                onChange={handleChange}
              ></input>
              {issubmitted && !formfield.segment ? (
                <div className="validationError">Required field</div>
              ) : (
                ""
              )}
            </div>
            <div className="frm-field">
              <label htmlFor="country">Country</label>
              <Multiselect
                className="custom-multiselect"
                options={Options}
                displayValue="country"
                hidePlaceholder={false}
                showCheckbox={true}
                placeholder="Select"
                selectedValues={selectedItems}
                onSelect={onSelect}
              ></Multiselect>
              {issubmitted && !formfield.country ? (
                <div className="validationError">Required field</div>
              ) : (
                ""
              )}
              <div className="multi-selected-opts-container">
                {selectedItems.map((item) => (
                  <div className="multi-selected-opts">
                    <div>{item.country}</div>
                    <div
                      className="delete-icon"
                      onClick={() => removeSelectedItem(item.id)}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="frm-field">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={formfield.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>
        </div>
        <div className="popup-footer-container">
          <div className="btn-container">
            <button className="btn-blue" type="submit" form="myForm">
              Submit
            </button>
            <div className="btn-blue" onClick={() => hideAddPopup()}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default AddEditSegmentForm;
