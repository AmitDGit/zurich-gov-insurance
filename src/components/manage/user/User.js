import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions, countryActions, regionActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditForm";
import UserProfile from "../../common-components/UserProfile";
import FrmInput from "../../common-components/frminput/FrmInput";
import { USER_ROLE } from "../../../constants";
function User({ ...props }) {
  const { userState, countryState, regionState } = props.state;
  const {
    getAll,
    getAllUsers,
    getAllCountry,
    getUserCountry,
    getUserRegions,
    getAllRegion,
    getAllSpecialUsers,
    getAllUsersRoles,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;

  useSetNavMenu({ currentMenu: "User", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryAllOpts, setcountryAllOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [userTypeFilterOpts, setuserTypeFilterOpts] = useState([]);
  const [unathorizedRegions, setunathorizedRegions] = useState([]);
  const [unauthorizedCountries, setunauthorizedCountries] = useState([]);
  const intialFilterState = {
    username: "",
    email: "",
    region: "",
    country: "",
    usertype: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterInput = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });

    if (name === "region" && value !== "") {
      let region = frmRegionSelectOpts.filter((item) => item.label === value);
      let tempmapObj = countrymapping.filter(
        (item) => item.region === region[0].value
      );
      let countryopts = [];
      if (tempmapObj.length) {
        countryopts = tempmapObj[0].country.map((item) => {
          return { label: item.label, value: item.label };
        });
      }
      setcountryFilterOpts([...countryopts]);
    } else if (name === "region" && value === "") {
      let countryopts = countryAllOpts.map((item) => {
        return { label: item.label, value: item.label };
      });
      setcountryFilterOpts([...countryopts]);
    }
  };
  const handleFilterSearch = () => {
    if (
      selfilter.username !== "" ||
      selfilter.email !== "" ||
      selfilter.region !== "" ||
      selfilter.country !== "" ||
      selfilter.usertype !== ""
    ) {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        let username = item.firstName + " " + item.lastName;
        if (
          isShow &&
          selfilter.username !== "" &&
          username &&
          !username.toLowerCase().includes(selfilter.username.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.email !== "" &&
          item.emailAddress &&
          !item.emailAddress
            .toLowerCase()
            .includes(selfilter.email.toLowerCase())
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.region !== "" &&
            item.regionList &&
            !item.regionList.includes(selfilter.region)) ||
          (isShow && selfilter.region !== "" && !item.regionList)
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.country !== "" &&
            item.countryList &&
            !item.countryList.includes(selfilter.country)) ||
          (isShow && selfilter.country !== "" && !item.countryList)
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.usertype !== "" &&
            item.userType &&
            !item.userType.includes(selfilter.usertype)) ||
          (isShow && selfilter.usertype !== "" && !item.userType)
        ) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
    setpaginationdata(data);
  };
  //set user role
  const [userroles, setuserroles] = useState({
    issuperadmin: false,
    isglobaladmin: false,
    isregionadmin: false,
    iscountryadmin: false,
  });
  useEffect(() => {
    let loggeduserrole = userProfile ? userProfile.userRoles[0].roleId : "";
    const tempuserroles = {
      issuperadmin: false,
      isglobaladmin: false,
      isregionadmin: false,
      iscountryadmin: false,
    };
    if (loggeduserrole === USER_ROLE.superAdmin) {
      tempuserroles.issuperadmin = true;
    }
    if (loggeduserrole === USER_ROLE.globalAdmin) {
      tempuserroles.isglobaladmin = true;
    }
    if (loggeduserrole === USER_ROLE.regionAdmin) {
      tempuserroles.isregionadmin = true;
    }
    if (loggeduserrole === USER_ROLE.countryAdmin) {
      tempuserroles.iscountryadmin = true;
    }
    setuserroles(tempuserroles);
  }, [userProfile]);
  //set pagination data and functionality
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columns = [
    {
      dataField: "editaction",
      text: "Edit",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.userId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "65px",
          textAlign: "center",
        };
      },
    },
    {
      dataField: "deleteaction",
      text: "Delete",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.userId}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return {
          width: "70px",
          textAlign: "center",
        };
      },
      align: "center",
    },
    {
      dataField: "emailAddress",
      text: "User Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <div className="">{getUserBlock(cell, row)}</div>;
      },
    },
    {
      dataField: "userType",
      text: "Type of User",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "regionList",
      text: "Region",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "countryList",
      text: "Country",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{cell ? cell : "-"}</span>;
      },
    },
  ];
  const getUserBlock = (cell, row) => {
    const username = row.firstName + " " + row.lastName;
    const userEmail = row.emailAddress;
    const imagePath = row.profileImagePath;

    return (
      <>
        <UserProfile
          username={username}
          userEmail={userEmail}
          imagePath={imagePath}
        ></UserProfile>
      </>
    );
  };
  const defaultSorted = [
    {
      dataField: "lobName",
      order: "asc",
    },
  ];

  useEffect(() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAllCountry({ IsLog: true });
    getAllRegion({ IsLog: true });
    getAllUsersRoles({ RequesterUserId: userProfile.userId });
  }, []);
  useEffect(() => {
    let tempdata = [];
    userState.items.forEach((item) => {
      if (userroles.isglobaladmin) {
        if (item.roleId !== USER_ROLE.superAdmin) {
          tempdata.push(item);
        }
      } else {
        tempdata.push(item);
      }
    });

    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
  }, [userState.items]);
  const [countrymapping, setcountrymapping] = useState([]);
  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
  const [frmuserType, setfrmuserType] = useState([]);
  const [frmuserTypeObj, setfrmuserTypeObj] = useState({});
  const [countryObj, setcountryObj] = useState({});
  useEffect(() => {
    let selectOpts = [];
    let selectFilterOpts = [];
    let tempCountryMapping = [];
    let tempRegionListObj = {};

    countryState.countryItems.forEach((item) => {
      selectOpts.push({
        label: item.countryName.trim(),
        value: item.countryID,
      });
      selectFilterOpts.push({
        label: item.countryName.trim(),
        value: item.countryName.trim(),
      });
      if (!tempRegionListObj[item.regionID]) {
        tempCountryMapping.push({
          region: item.regionID,
          country: [
            {
              label: item.countryName,
              value: item.countryID,
            },
          ],
        });
      } else {
        tempCountryMapping.forEach((countryitem) => {
          if (countryitem.region === item.regionID) {
            countryitem.country.push({
              label: item.countryName,
              value: item.countryID,
            });
          }
        });
      }
      tempRegionListObj[item.regionID] = item.countryName;
    });
    selectOpts.sort(dynamicSort("label"));
    if (selectOpts.length) {
      setfrmCountrySelectOpts([...selectOpts]);
    }
    setcountryAllOpts([...selectOpts]);
    setcountryFilterOpts([...selectFilterOpts]);
    setcountrymapping([...tempCountryMapping]);
  }, [countryState.countryItems]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    let selectFilterOpts = [];
    regionState.regionItems.forEach((item) => {
      selectOpts.push({
        label: item.regionName.trim(),
        value: item.regionID,
      });
      selectFilterOpts.push({
        label: item.regionName.trim(),
        value: item.regionName.trim(),
      });
    });
    selectOpts.sort(dynamicSort("label"));
    selectFilterOpts.sort(dynamicSort("label"));
    if (selectOpts.length) {
      setfrmRegionSelectOpts([...selectOpts]);
    }
    setregionFilterOpts([...selectFilterOpts]);
  }, [regionState.regionItems]);

  useEffect(() => {
    let tempuserroles = [];
    let tempfilterroles = [];
    let tempObj = {};
    userState.userRoles.forEach((item) => {
      if (
        (userroles.iscountryadmin && item.roleId === USER_ROLE.countryAdmin) ||
        (USER_ROLE.regionAdmin &&
          (item.roleId === USER_ROLE.countryAdmin ||
            item.roleId === USER_ROLE.regionAdmin)) ||
        (userroles.isglobaladmin &&
          (item.roleId === USER_ROLE.countryAdmin ||
            item.roleId === USER_ROLE.regionAdmin ||
            item.roleId === USER_ROLE.globalAdmin)) ||
        userroles.issuperadmin
      ) {
        tempuserroles.push({
          label: item.displayRole,
          value: item.roleId,
        });
        tempfilterroles.push({
          label: item.displayRole,
          value: item.displayRole,
        });
      }
      tempObj[item.roleId] = item.displayRole;
    });
    setfrmuserType([...tempuserroles]);
    setfrmuserTypeObj(tempObj);
    setuserTypeFilterOpts([...tempfilterroles]);
  }, [userState.userRoles]);
  /* Add Edit Delete functionality & show popup*/
  console.log(userState);
  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(formInitialValue);
    setisEditMode(false);
    // getAllApprover({ UserName: "#$%" });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const formInitialValue = {
    user: [],
    regionList: [],
    countryList: [],
    userType: "",
    PreviousRoleID: "",
    isAccessBreachLog: false,
    isSuperAdmin: false,
  };
  const [formIntialState, setformIntialState] = useState(formInitialValue);

  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ UserId: itemid });
    let userCountry = await getUserCountry({ IsLog: true });
    let userRegions = await getUserRegions({ IsLog: true });
    const user = [
      {
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        emailAddress: response.emailAddress,
      },
    ];
    let regionList = [];
    let countryList = [];
    let tempunauthorizedRegions = [];
    let tempunauthorizedCountries = [];

    response.regionDataList.forEach((item) => {
      let isPresent = false;
      userRegions.forEach((region) => {
        if (region.regionID === item.regionID.trim()) {
          isPresent = true;
        }
      });
      if (isPresent) {
        regionList.push({
          label: item.regionName.trim(),
          value: item.regionID.trim(),
        });
      } else {
        tempunauthorizedRegions.push({
          label: item.regionName.trim(),
          value: item.regionID.trim(),
        });
      }
    });
    response.countryDataList.forEach((item) => {
      let isPresent = false;
      userCountry.forEach((country) => {
        if (country.countryID === item.countryID.trim()) {
          isPresent = true;
        }
      });
      if (isPresent) {
        countryList.push({
          label: item.countryName.trim(),
          value: item.countryID.trim(),
        });
      } else {
        tempunauthorizedCountries.push({
          label: item.countryName.trim(),
          value: item.countryID.trim(),
        });
      }
    });
    setisEditMode(true);
    let isSuperAdmin = response.userType === "SuperAdmin" ? true : false;

    setformIntialState({
      user: user,
      regionList: regionList,
      countryList: countryList,
      userType: response.roleId,
      PreviousRoleID: response.roleId,
      isAccessBreachLog: response.isAccessBreachLog,
      isSuperAdmin: isSuperAdmin,
    });
    setunathorizedRegions([...tempunauthorizedRegions]);
    setunauthorizedCountries([...tempunauthorizedCountries]);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    const { userId, firstName, lastName, emailAddress } = item.user[0];
    let tempcountryList = item.countryList.map((item) => item.value);
    let tempunauthorizedCountryList = unauthorizedCountries.map(
      (item) => item.value
    );
    tempcountryList = [...tempcountryList, ...tempunauthorizedCountryList].join(
      ","
    );
    let tempregionList = item.regionList.map((item) => item.value);
    let tempunauthorizedRegionList = unathorizedRegions.map(
      (item) => item.value
    );
    tempregionList = [...tempregionList, ...tempunauthorizedRegionList].join(
      ","
    );
    if (item.isSuperAdmin) {
      item.isAccessBreachLog = true;
      for (let i = 0; i < frmuserType.length; i++) {
        if (frmuserType[i]["label"] === "Super Admin") {
          item.userType = frmuserType[i]["value"];
        }
      }
    }
    let response = await postItem({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      RoleID: item.userType,
      regionList: tempregionList,
      countryList: tempcountryList,
      isAccessBreachLog: item.isAccessBreachLog,
      requesterUserId: userProfile.userId,
      PreviousRoleID: item.PreviousRoleID,
    });
    if (response) {
      setselfilter(intialFilterState);
      getAll({ RequesterUserId: userProfile.userId });
      hideAddPopup();
      alert(alertMessage.user.update);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    const { firstName, lastName, emailAddress } = item.user[0];
    let response = await checkNameExist({
      emailAddress: emailAddress,
    });
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.join(",");
    let tempregionList = item.regionList.map((item) => item.value);
    tempregionList = tempregionList.join(",");
    if (item.isSuperAdmin) {
      item.isAccessBreachLog = true;
      for (let i = 0; i < frmuserType.length; i++) {
        if (frmuserType[i]["label"] === "Super Admin") {
          item.userType = frmuserType[i]["value"];
        }
      }
    }
    if (!response) {
      response = await postItem({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        RoleID: item.userType,
        PreviousRoleID: "",
        regionList: tempregionList,
        countryList: tempcountryList,
        isAccessBreachLog: item.isAccessBreachLog,
        requesterUserId: userProfile.userId,
      });

      if (response) {
        setselfilter(intialFilterState);
        getAll({ RequesterUserId: userProfile.userId });
        hideAddPopup();
        alert(alertMessage.user.add);
      }
    } else {
      alert(alertMessage.user.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.user.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ UserId: itemid });
    if (!resonse) {
      resonse = await deleteItem({ UserId: itemid });
      if (resonse) {
        getAll({ RequesterUserId: userProfile.userId });
        alert(alertMessage.user.delete);
      }
    } else {
      alert(alertMessage.user.isInUse);
    }
  };

  /* search Input functionality */
  const [searchOptions, setsearchOptions] = useState([]);
  useEffect(() => {
    setsearchOptions(userState.approverUsers);
  }, [userState.approverUsers]);

  return (
    <>
      <div className="page-title">Manage User</div>
      <div className="page-filter">
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"Region"}
              name={"region"}
              selectopts={regionFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.region}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"Country"}
              name={"country"}
              selectopts={countryFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.country}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"Type of User"}
              name={"usertype"}
              selectopts={userTypeFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.usertype}
            />
          </div>
          <div className="frm-filter">
            <FrmInput
              title={"User"}
              name={"username"}
              type={"input"}
              handleChange={onSearchFilterInput}
              value={selfilter.username}
            />
          </div>
          <div className="frm-filter">
            <FrmInput
              title={"Email"}
              name={"email"}
              type={"input"}
              handleChange={onSearchFilterInput}
              value={selfilter.email}
            />
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.username === "" &&
              selfilter.email === "" &&
              selfilter.region === "" &&
              selfilter.country === "" &&
              selfilter.usertype === ""
                ? "disable"
                : ""
            }`}
            onClick={handleFilterSearch}
          >
            Search
          </div>
          <div className="btn-blue" onClick={clearFilter}>
            Clear
          </div>
        </div>
      </div>
      <div>
        {userState.loading ? (
          <Loading />
        ) : userState.error ? (
          <div>{userState.error}</div>
        ) : (
          <PaginationData
            id={"userId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New User"}
            hidesearch={true}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit User"}
          frmCountrySelectOpts={frmCountrySelectOpts}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmuserType={frmuserType.filter(
            (item) => item.label !== "Super Admin"
          )}
          frmuserTypeObj={frmuserTypeObj}
          countrymapping={countrymapping}
          countryAllOpts={countryAllOpts}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
          userroles={userroles}
        ></AddEditForm>
      ) : (
        ""
      )}
    </>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: userActions.getAll,
  getAllUsers: userActions.getAllUsers,
  getAllCountry: countryActions.getAllCountry,
  getUserCountry: countryActions.getUserCountry,
  getAllRegion: regionActions.getAllRegions,
  getUserRegions: regionActions.getUserRegions,
  getAllSpecialUsers: userActions.getAllSpecialUsers,
  getAllUsersRoles: userActions.getAllUsersRoles,
  getById: userActions.getById,
  checkNameExist: userActions.checkNameExist,
  checkIsInUse: userActions.checkIsInUse,
  postItem: userActions.postItem,
  deleteItem: userActions.deleteItem,
};

export default connect(mapStateToProp, mapActions)(User);
