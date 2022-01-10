import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { userActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import Dropdown from "../../common-components/Dropdown";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditForm";
import UserProfile from "../../common-components/UserProfile";
import InputFilter from "../../common-components/InputFilter";

function User({ ...props }) {
  const { userState } = props.state;
  const {
    getAll,
    getAllUsers,
    getAllCountry,
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

  console.log(userState);
  useSetNavMenu({ currentMenu: "User", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [countryFilterOpts, setcountryFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [countryAllOpts, setcountryAllOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [userTypeFilterOpts, setuserTypeFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const intialFilterState = {
    username: "",
    email: "",
    region: "",
    country: "",
    usertype: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterSelect = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });

    if (name === "region" && value !== "") {
      let region = frmRegionSelectOpts.filter((item) => item.title === value);
      let tempmapObj = countrymapping.filter(
        (item) => item.region === region[0].value
      );
      let countryopts = tempmapObj[0].country.map((item) => {
        return { title: item.title, value: item.title };
      });

      setcountryFilterOpts([{ title: "Select", value: "" }, ...countryopts]);
    } else if (name === "region" && value === "") {
      let countryopts = countryAllOpts.map((item) => {
        return { title: item.title, value: item.title };
      });
      setcountryFilterOpts([{ title: "Select", value: "" }, ...countryopts]);
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
          width: "50px",
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
    getAllCountry();
    getAllRegion();
    getAllUsersRoles({ RequesterUserId: userProfile.userId });
  }, []);
  useEffect(() => {
    let tempdata = [];
    /* let tempregionFilterOpts = [];
    let tempCountryFilterOpts = [];
    let tempCountryObj = {};
    let tempRegionObj = {};*/

    userState.items.forEach((item) => {
      tempdata.push(item);
      /*let regionlist = item.regionList ? item.regionList.split(",") : [];
      regionlist.forEach((regionitem) => {
        let tempItem = regionitem.trim();
        if (!tempRegionObj[tempItem]) {
          tempregionFilterOpts.push({
            title: tempItem,
            value: tempItem,
          });
        }
        tempRegionObj[tempItem] = tempItem;
      });
      let coutrylist = item.countryList;
      if (coutrylist) {
        coutrylist = coutrylist.split(",");
        coutrylist.forEach((countryItem) => {
          let tempItem = countryItem.trim();
          if (!tempCountryObj[tempItem]) {
            tempCountryFilterOpts.push({
              title: tempItem,
              value: tempItem,
            });
          }
          tempCountryObj[tempItem] = tempItem;
        });
      }*/
    });

    setdata([...tempdata]);
    setpaginationdata([...tempdata]);

    /*tempregionFilterOpts.sort(dynamicSort("title"));
    tempCountryFilterOpts.sort(dynamicSort("title"));
    setregionFilterOpts([
      { title: "Select", value: "" },
      ...tempregionFilterOpts,
    ]);
    setcountryFilterOpts([
      { title: "Select", value: "" },
      ...tempCountryFilterOpts,
    ]);*/
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

    userState.countryItems.forEach((item) => {
      selectOpts.push({
        title: item.countryName.trim(),
        value: item.countryID,
      });
      selectFilterOpts.push({
        title: item.countryName.trim(),
        value: item.countryName.trim(),
      });
      if (!tempRegionListObj[item.regionID]) {
        tempCountryMapping.push({
          region: item.regionID,
          country: [
            {
              title: item.countryName,
              value: item.countryID,
            },
          ],
        });
      } else {
        tempCountryMapping.forEach((countryitem) => {
          if (countryitem.region === item.regionID) {
            countryitem.country.push({
              title: item.countryName,
              value: item.countryID,
            });
          }
        });
      }
      tempRegionListObj[item.regionID] = item.countryName;
    });
    selectOpts.sort(dynamicSort("title"));
    setfrmCountrySelectOpts([...selectOpts]);
    setcountryAllOpts([...selectOpts]);
    setcountryFilterOpts([{ title: "Select", value: "" }, ...selectFilterOpts]);

    setcountrymapping([...tempCountryMapping]);
  }, [userState.countryItems]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  useEffect(() => {
    let selectOpts = [];
    let selectFilterOpts = [];
    userState.regionItems.forEach((item) => {
      selectOpts.push({
        title: item.regionName.trim(),
        value: item.regionID,
      });
      selectFilterOpts.push({
        title: item.regionName.trim(),
        value: item.regionName.trim(),
      });
    });
    selectOpts.sort(dynamicSort("title"));
    selectFilterOpts.sort(dynamicSort("title"));
    setfrmRegionSelectOpts([...selectOpts]);
    setregionFilterOpts([{ title: "Select", value: "" }, ...selectFilterOpts]);
  }, [userState.regionItems]);

  useEffect(() => {
    let tempuserroles = [];
    let tempfilterroles = [];
    let tempObj = {};
    userState.userRoles.forEach((item) => {
      if (item.roleName !== "SuperAdmin") {
        tempuserroles.push({
          title: item.roleName,
          value: item.roleId,
        });
      }
      tempObj[item.roleId] = item.roleName;
      tempfilterroles.push({ title: item.roleName, value: item.roleName });
    });
    setfrmuserType([...tempuserroles]);
    setfrmuserTypeObj(tempObj);
    setuserTypeFilterOpts([{ title: "Select", value: "" }, ...tempfilterroles]);
  }, [userState.userRoles]);
  /* Add Edit Delete functionality & show popup*/

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
    const user = [
      {
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        emailAddress: response.emailAddress,
      },
    ];
    const regionList = response.regionDataList.map((item) => {
      return {
        title: item.regionName.trim(),
        value: item.regionID.trim(),
      };
    });
    const countryList = response.countryDataList.map((item) => {
      return {
        title: item.countryName.trim(),
        value: item.countryID.trim(),
      };
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
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    const { userId, firstName, lastName, emailAddress } = item.user[0];
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.join(",");
    let tempregionList = item.regionList.map((item) => item.value);
    tempregionList = tempregionList.join(",");
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
      for (let i = 0; i < frmuserType.length; i++) {
        if (frmuserType[i]["title"] === "SuperAdmin") {
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
          <Dropdown
            label={"Region"}
            name={"region"}
            selectopts={regionFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.region}
          />
          <Dropdown
            label={"Country"}
            name={"country"}
            selectopts={countryFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.country}
          />
          <Dropdown
            label={"User Access"}
            name={"usertype"}
            selectopts={userTypeFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.usertype}
          />
          <InputFilter
            label={"User"}
            name={"username"}
            type={"input"}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.username}
          />
          <InputFilter
            label={"Email"}
            name={"email"}
            type={"input"}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.email}
          />
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
            buttonTitle={"+ New User"}
            hidesearch={true}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit User"}
          frmCountrySelectOpts={frmCountrySelectOpts}
          frmRegionSelectOpts={frmRegionSelectOpts}
          frmuserType={frmuserType}
          frmuserTypeObj={frmuserTypeObj}
          countrymapping={countrymapping}
          countryAllOpts={countryAllOpts}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
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
  getAllCountry: userActions.getAllCountry,
  getAllRegion: userActions.getAllRegion,
  getAllSpecialUsers: userActions.getAllSpecialUsers,
  getAllUsersRoles: userActions.getAllUsersRoles,
  getById: userActions.getById,
  checkNameExist: userActions.checkNameExist,
  checkIsInUse: userActions.checkIsInUse,
  postItem: userActions.postItem,
  deleteItem: userActions.deleteItem,
};

export default connect(mapStateToProp, mapActions)(User);
