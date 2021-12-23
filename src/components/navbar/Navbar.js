import React, { useEffect } from "react";
import { Link } from "react-router-dom";
function Navbar({ ...props }) {
  const { appmenu } = props.state;
  const { location } = props;
  return (
    <nav className="menu-nav">
      <div className="nav-links">
        <Link to="/">
          <div className={`menu-item ${location.pathname === "/" && "active"}`}>
            Dashboard
          </div>
        </Link>
        <Link to="/region">
          <div className="menu-item">Manage</div>
          {appmenu.isSubmenu ? (
            <div className="submenu-container">
              <Link to="/region">
                <div
                  className={`menu-item ${location.pathname === "/region" &&
                    "active"}`}
                >
                  Region
                </div>
              </Link>
              <Link to="/country">
                <div
                  className={`menu-item ${location.pathname === "/country" &&
                    "active"}`}
                >
                  Country
                </div>
              </Link>
              <Link to="/segment">
                <div
                  className={`menu-item ${location.pathname === "/segment" &&
                    "active"}`}
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
                  className={`menu-item ${location.pathname === "/sublob" &&
                    "active"}`}
                >
                  Sub-LoB
                </div>
              </Link>
              <Link to="/lobchapter">
                <div
                  className={`menu-item ${location.pathname === "/lobchapter" &&
                    "active"}`}
                >
                  LoB Chapter
                </div>
              </Link>
              <Link to="/user">
                <div
                  className={`menu-item ${location.pathname === "/user" &&
                    "active"}`}
                >
                  User
                </div>
              </Link>
              <Link to="/lookup">
                <div
                  className={`menu-item ${location.pathname === "/lookup" &&
                    "active"}`}
                >
                  Lookup
                </div>
              </Link>
            </div>
          ) : (
            ""
          )}
        </Link>
        <Link to="/breachlogs">
          <div
            className={`menu-item ${location.pathname === "/breachlogs" &&
              "active"}`}
          >
            Breach Logs
          </div>
        </Link>
        <Link to="/rfelogs">
          <div
            className={`menu-item ${location.pathname === "/rfelogs" &&
              "active"}`}
          >
            RFE Logs
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
