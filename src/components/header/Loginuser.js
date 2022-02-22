import React, { useState, useRef, useEffect } from "react";
import locationlogo from "../../assets/location.png";
import TokenService from "../../services/Tokenservice";
function LoggedInUser() {
  const logout = () => {
    TokenService.removeUser();
    window.location.reload(true);
  };
  const [showlogout, setshowlogout] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div className="loggeduser-container">
      <div className="loggeduser">
        <div className="userregion-container">
          <div className="user-region">EMEA</div>
          <div className="user-country">Switzerland</div>
        </div>
        <div className="userregion-logo">
          <img src={locationlogo}></img>
        </div>
        <div
          className="user-image profile-picture"
          onClick={() => setshowlogout(!showlogout)}
        >
          <img></img>
        </div>
      </div>
      {showlogout && (
        <div className="logout-container" ref={wrapperRef}>
          <div className="logout-btn" onClick={logout}>
            Log out
          </div>
        </div>
      )}
    </div>
  );
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setshowlogout(false);
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

export default LoggedInUser;
