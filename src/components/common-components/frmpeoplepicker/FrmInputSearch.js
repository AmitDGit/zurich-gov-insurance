import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { debounce } from "lodash";
import { lobActions } from "../../../actions";
import UserProfile from "../UserProfile";
import "./Style.css";
function FrmInputSearch(props) {
  const {
    title,
    name,
    value,
    type,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    searchItems,
    singleSelection,
    handleInputSearchChange,
    isEditMode,
  } = props;
  const isSingleSelect = singleSelection ? singleSelection : false;
  const delayedHandleChange = useCallback(
    debounce((e) => {
      handleInputSearchChange(e);
      setshowsearchResultBox(true);
    }, 500)
  );
  const handleSearchChange = (e) => {
    delayedHandleChange(e);
  };
  const initapproverval = value ? value : [];
  const [approvers, setapprovers] = useState(initapproverval);
  const [inputSearchOptions, setinputSearchOptions] = useState([]);
  const [showsearchResultBox, setshowsearchResultBox] = useState(false);

  /*useEffect(() => {
    getAllApprover({ UserName: "#$%" });
    setinputSearchOptions([]);
  }, []);*/

  useEffect(() => {
    let searchListApprovers = [];
    searchItems.forEach((searchItem) => {
      let isPresent = false;
      approvers.forEach((approver) => {
        if (approver.emailAddress === searchItem.emailAddress) {
          isPresent = true;
        }
      });
      if (!isPresent) {
        searchListApprovers.push(searchItem);
      }
    });
    setinputSearchOptions([...searchListApprovers]);
  }, [searchItems]);

  const handleAddItem = (userId) => {
    let tempApprover = inputSearchOptions.filter(
      (user) => user.emailAddress === userId
    );
    let searchListApprovers = [];
    if (isSingleSelect) {
      setapprovers([...tempApprover]);
      searchListApprovers = [...approvers, ...inputSearchOptions].filter(
        (approver) => approver.emailAddress !== tempApprover[0].emailAddress
      );
      closesearchBox();
    } else {
      setapprovers([...approvers, ...tempApprover]);
      searchListApprovers = inputSearchOptions.filter(
        (approver) => approver.emailAddress !== tempApprover[0].emailAddress
      );
    }
    setinputSearchOptions([...searchListApprovers]);
  };
  useEffect(() => {
    handleChange(name, approvers);
  }, [approvers]);
  const handleRemoveItem = (userId) => {
    let tempApprover = [...approvers];
    tempApprover = tempApprover.filter((user) => user.emailAddress !== userId);
    setapprovers([...tempApprover]);
  };
  const closesearchBox = () => {
    setshowsearchResultBox(false);
    inputRef.current.value = "";
  };
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div className={`frm-field people-picker ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      <input
        className={`${showsearchResultBox ? "open" : ""}`}
        autocomplete="off"
        type={type}
        name={name}
        onChange={handleSearchChange}
        disabled={isEditMode}
        ref={inputRef}
      ></input>
      {isRequired && issubmitted && !value.length ? (
        <div className="validationError">{validationmsg}</div>
      ) : (
        ""
      )}
      <div className="approver-list-container">
        {approvers.map((user) => getApproverBlock(user))}
      </div>
      {inputSearchOptions.length && showsearchResultBox ? (
        <div className="searched-container" ref={wrapperRef}>
          {inputSearchOptions.map((user) => (
            <div className="user-view">
              <div className="user">{user.firstName + " " + user.lastName}</div>
              <div
                className="addbtn"
                onClick={() => handleAddItem(user.emailAddress)}
              >
                +
              </div>
            </div>
          ))}
        </div>
      ) : showsearchResultBox ? (
        <div className="searched-container" ref={wrapperRef}>
          <div className="user-view">
            <i>No result found</i>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  function getApproverBlock(user) {
    const username = user.firstName + " " + user.lastName;
    const userEmail = user.emailAddress;
    const imagePath = user.profileImagePath ? user.profileImagePath : "";
    return (
      <div className="approver-container">
        <UserProfile
          username={username}
          userEmail={userEmail}
          imagePath={imagePath}
        ></UserProfile>
        {isEditMode && singleSelection ? (
          ""
        ) : (
          <div
            className="delete-icon"
            onClick={() => handleRemoveItem(user.emailAddress)}
          ></div>
        )}
      </div>
    );
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          closesearchBox();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
}

export default React.memo(FrmInputSearch);
/*const mapStateToProp = (state) => {
  return {
    lobState: state.lobState,
  };
};
const mapActions = {
  getAllApprover: lobActions.getAllApprover,
};
export default connect(mapStateToProp, mapActions)(FrmInputSearch);
*/
