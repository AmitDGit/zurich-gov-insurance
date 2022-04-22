import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { USER_ROLE } from "../../constants";
import useUserProfile from "../../customhooks/useUserProfile";
function Navbar({ ...props }) {
  const { appmenu } = props.state;
  const { location, userProfile } = props;

  const [loggeduserrole, setloggeduserrole] = useState("");
  // const [roleadmin, setroleadmin] = useState(false);
  const userProfiles = useUserProfile();
  /*useEffect(() => {
    let loggeduserrole = userProfile ? userProfile.userRoles[0].roleId : "";
    let roleadmin = false;
    if (
      loggeduserrole === USER_ROLE.globalAdmin ||
      loggeduserrole === USER_ROLE.regionAdmin
    ) {
      roleadmin = true;
    }
    setloggeduserrole(loggeduserrole);
    setroleadmin(roleadmin);
  }, [userProfile]);*/

  //console.log(userProfile);
  return (
    <nav className="menu-nav">
      <div className="nav-links">
        <Link to="/">
          <div className={`menu-item ${location.pathname === "/" && "active"}`}>
            Dashboard
          </div>
        </Link>
        {userProfile && (
          <>
            {userProfiles && userProfiles.isSuperAdmin && (
              <Link to="/region">
                <div className="menu-item">Manage</div>
              </Link>
            )}
            {userProfiles &&
              !userProfiles.isSuperAdmin &&
              (userProfiles.isGlobalAdmin || userProfiles.isRegionAdmin) && (
                <Link to="/user">
                  <div className="menu-item">Manage</div>
                </Link>
              )}
            {appmenu.isSubmenu ? (
              <div className="submenu-container">
                {userProfiles && userProfiles.isSuperAdmin && (
                  <>
                    <Link to="/region">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/region" && "active"}`}
                      >
                        Region
                      </div>
                    </Link>
                    <Link to="/country">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/country" && "active"}`}
                      >
                        Country
                      </div>
                    </Link>
                    <Link to="/segment">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/segment" && "active"}`}
                      >
                        Segment
                      </div>
                    </Link>
                    <Link to="/lob">
                      <div
                        className={`menu-item ${location.pathname === "/lob" &&
                          "active"}`}
                      >
                        LoB
                      </div>
                    </Link>
                    <Link to="/sublob">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/sublob" && "active"}`}
                      >
                        Sub-LoB
                      </div>
                    </Link>
                    <Link to="/lobchapter">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/lobchapter" && "active"}`}
                      >
                        LoB Chapter
                      </div>
                    </Link>
                    <Link to="/znaorganization1">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/znaorganization1" && "active"}`}
                      >
                        ZNA Organization 1
                      </div>
                    </Link>
                    <Link to="/znaorganization2">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/znaorganization2" && "active"}`}
                      >
                        ZNA Organization 2
                      </div>
                    </Link>
                    <Link to="/znaorganization3">
                      <div
                        className={`menu-item ${location.pathname ===
                          "/znaorganization3" && "active"}`}
                      >
                        ZNA Organization 3
                      </div>
                    </Link>
                  </>
                )}
                {userProfiles &&
                  (userProfiles.isSuperAdmin ||
                    userProfiles.isGlobalAdmin ||
                    userProfiles.isRegionAdmin) && (
                    <Link to="/user">
                      <div
                        className={`menu-item ${location.pathname === "/user" &&
                          "active"}`}
                      >
                        User
                      </div>
                    </Link>
                  )}
                {userProfiles && userProfiles.isSuperAdmin && (
                  <Link to="/lookup">
                    <div
                      className={`menu-item ${location.pathname === "/lookup" &&
                        "active"}`}
                    >
                      Lookup
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              ""
            )}
          </>
        )}

        {userProfile && userProfile.isAccessBreachLog && (
          <Link to="/breachlogs">
            <div
              className={`menu-item ${location.pathname === "/breachlogs" &&
                "active"}`}
            >
              Breach Logs
            </div>
          </Link>
        )}

        <Link to="/rfelogs">
          <div
            className={`menu-item ${location.pathname === "/rfelogs" &&
              "active"}`}
          >
            RfE Logs
          </div>
        </Link>
        <Link to="/exemptionlogs">
          <div
            className={`menu-item ${location.pathname === "/exemptionlogs" &&
              "active"}`}
          >
            Exemption Logs
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
