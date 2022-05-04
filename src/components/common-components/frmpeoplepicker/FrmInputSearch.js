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
    suggestedapprovers,
    singleSelection,
    handleInputSearchChange,
    isEditMode,
  } = props;

  const isSingleSelect = singleSelection ? singleSelection : false;
  const [showloading, setshowloading] = useState(false);
  const delayedHandleChange = useCallback(
    debounce((e) => {
      handleInputSearchChange(e);
      setshowsearchResultBox(true);
    }, 500)
  );
  const handleSearchChange = (e) => {
    delayedHandleChange(e);
    setshowloading(true);
  };
  const initapproverval = value ? value : [];
  const [approvers, setapprovers] = useState(initapproverval);
  const [inputSearchOptions, setinputSearchOptions] = useState([]);
  const [suggestedOptions, setsuggestedOptions] = useState([]);
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
    setshowloading(false);
    setinputSearchOptions([...searchListApprovers]);
  }, [searchItems]);

  useEffect(() => {
    let searchListApprovers = [];

    if (suggestedapprovers) {
      suggestedapprovers.forEach((suggestedItem) => {
        let isPresent = false;
        approvers.forEach((approver) => {
          if (approver.emailAddress === suggestedItem.emailAddress) {
            isPresent = true;
          }
        });
        if (!isPresent) {
          searchListApprovers.push(suggestedItem);
        }
      });
    }
    setsuggestedOptions([...searchListApprovers]);
  }, [suggestedapprovers]);

  const handleAddItem = (userId, issuggested) => {
    let tempApprover;
    if (issuggested) {
      tempApprover = suggestedOptions.filter(
        (user) => user.emailAddress === userId
      );
    } else {
      tempApprover = inputSearchOptions.filter(
        (user) => user.emailAddress === userId
      );
    }
    let searchListApprovers = [];
    if (isSingleSelect) {
      setapprovers([...tempApprover]);
      if (issuggested) {
        searchListApprovers = suggestedapprovers.filter(
          (approver) => approver.emailAddress !== tempApprover[0].emailAddress
        );
      } else {
        searchListApprovers = [...approvers, ...inputSearchOptions].filter(
          (approver) => approver.emailAddress !== tempApprover[0].emailAddress
        );
        closesearchBox();
      }
    } else {
      setapprovers([...approvers, ...tempApprover]);
      if (issuggested) {
        searchListApprovers = suggestedOptions.filter(
          (approver) => approver.emailAddress !== tempApprover[0].emailAddress
        );
      } else {
        searchListApprovers = inputSearchOptions.filter(
          (approver) => approver.emailAddress !== tempApprover[0].emailAddress
        );
      }
    }
    if (issuggested) {
      setsuggestedOptions([...searchListApprovers]);
    } else {
      setinputSearchOptions([...searchListApprovers]);
    }
  };
  useEffect(() => {
    handleChange(name, approvers);
  }, [approvers]);

  const handleRemoveItem = (userId) => {
    let tempApprover = [...approvers];
    tempApprover = tempApprover.filter((user) => user.emailAddress !== userId);
    setapprovers([...tempApprover]);
    if (suggestedapprovers) {
      let tempsuggestedappr = suggestedapprovers.filter(
        (user) => user.emailAddress === userId
      );
      setsuggestedOptions([...suggestedOptions, ...tempsuggestedappr]);
    }
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
      {suggestedOptions.length ? (
        <div className="suggested-users border-bottom">
          <div className="title">
            <b>List of recommended approvers</b>
          </div>
          {suggestedOptions.map((user) => getApproverBlock(user, true))}
        </div>
      ) : (
        ""
      )}
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      <div className="search-com-container">
        <input
          className={`${showsearchResultBox ? "open" : ""}`}
          autocomplete="off"
          type={type}
          name={name}
          onChange={handleSearchChange}
          disabled={isEditMode}
          ref={inputRef}
        ></input>
        {isRequired && issubmitted && !approvers.length ? (
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
                <div className="user">
                  {user.firstName + " " + user.lastName}
                </div>
                <div
                  className="addbtn"
                  onClick={() => handleAddItem(user.emailAddress)}
                >
                  +
                </div>
              </div>
            ))}
          </div>
        ) : showsearchResultBox && !showloading ? (
          <div className="searched-container" ref={wrapperRef}>
            <div className="user-view">
              <i>No result found</i>
            </div>
          </div>
        ) : (
          ""
        )}
        {showloading && (
          <div>
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
          </div>
        )}
      </div>
    </div>
  );
  function getApproverBlock(user, showAdd) {
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
        {(isEditMode && singleSelection) || showAdd ? (
          ""
        ) : (
          <div
            className="delete-icon"
            onClick={() => handleRemoveItem(user.emailAddress)}
          ></div>
        )}
        {showAdd && (
          <div
            className="addbtn"
            onClick={() => handleAddItem(user.emailAddress, true)}
          >
            +
          </div>
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
