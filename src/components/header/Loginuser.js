import React, { useState, useRef, useEffect } from "react";
import locationlogo from "../../assets/location.png";
import TokenService from "../../services/Tokenservice";
import useUserProfile from "../../customhooks/useUserProfile";
import { userprofileActions } from "../../actions";
import { connect } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";
function LoggedInUser({ ...props }) {
  const { userprofileState } = props.state;
  const { setOktaAuthenticated, setOktaToken, setOktaUserProfile } = props;
  const { oktaAuth, authState } = useOktaAuth();
  const [userProfile, setuserProfile] = useState("");
  useEffect(() => {
    const getuser = async () => {
      if (authState && authState.isAuthenticated) {
        setOktaAuthenticated();
        let tempUserProfile = await oktaAuth.getUser();
        let tempToken = await oktaAuth.getAccessToken();
        console.log(userprofileState);
        if (tempUserProfile) {
          setOktaUserProfile(tempUserProfile);
          setuserProfile(tempUserProfile);
        }
        if (tempToken) {
          setOktaToken(tempToken);
        }
      }
    };
    getuser();
  }, [authState]);

  const logout = async () => {
    setshowlogout(false);
    // oktaAuth.signOut();
    TokenService.removeUser();
    window.location.reload(true);
  };
  const [showlogout, setshowlogout] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    userprofileState.isAuthenticated && (
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
            <div>{userProfile.name}</div>
            <div className="logout-btn" onClick={logout}>
              Log out
            </div>
          </div>
        )}
      </div>
    )
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

const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  setOktaAuthenticated: userprofileActions.setOktaAuthenticated,
  setOktaUserProfile: userprofileActions.setOktaUserProfile,
  setOktaToken: userprofileActions.setOktaToken,
};
export default connect(mapStateToProp, mapActions)(LoggedInUser);
