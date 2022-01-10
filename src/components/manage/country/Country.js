import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { countryActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import Dropdown from "../../common-components/Dropdown";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Country({ ...props }) {
  const { countryState } = props.state;
  const {
    getAll,
    getAllRegions,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "Country", isSubmenu: true }, props.menuClick);
  console.log(countryState);
  //initialize filter/search functionality
  const [countryFilterOpts, setcountryFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [countryFilterAllOpts, setcountryFilterAllOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [countrymapping, setcountrymapping] = useState([]);
  const intialfilterval = {
    country: "",
    region: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const onSearchFilterSelect = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
    console.log(selfilter);
  };
  const handleFilterSearch = () => {
    if (selfilter.country !== "" || selfilter.region !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.country !== "" &&
          item.countryID !== selfilter.country
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.region !== "" &&
          item.regionID !== selfilter.region
        ) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter(intialfilterval);
    setpaginationdata(data);
  };
  useEffect(() => {
    if (selfilter.region !== "") {
      let tempFilterOpts = countrymapping.filter((item) => {
        if (item.region == selfilter.region) {
          return item;
        }
      });
      setcountryFilterOpts([
        { title: "Select", value: "" },
        ...tempFilterOpts[0].country.sort(dynamicSort("title")),
      ]);
    } else {
      setcountryFilterOpts([...countryFilterAllOpts]);
    }
  }, [selfilter.region]);
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
            rowid={row.countryID}
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
            rowid={row.countryID}
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
      dataField: "countryName",
      text: "Country",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "countryDescription",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "countryName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAllRegions();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempCountryFilterOpts = [];
    let tempRegionFilterOpts = [];
    let tempRegionListObj = {};
    let tempCountryMapping = [];
    countryState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        tempCountryFilterOpts.push({
          title: item.countryName,
          value: item.countryID,
        });
        if (!tempRegionListObj[item.regionID]) {
          tempRegionFilterOpts.push({
            title: item.regionName,
            value: item.regionID,
          });
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
        tempRegionListObj[item.regionID] = item.regionName;
      }
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    tempCountryFilterOpts.sort(dynamicSort("title"));
    tempRegionFilterOpts.sort(dynamicSort("title"));
    setcountryFilterOpts([
      { title: "Select", value: "" },
      ...tempCountryFilterOpts,
    ]);
    setcountryFilterAllOpts([
      { title: "Select", value: "" },
      ...tempCountryFilterOpts,
    ]);
    setregionFilterOpts([
      { title: "Select", value: "" },
      ...tempRegionFilterOpts,
    ]);
    setcountrymapping([...tempCountryMapping]);
  }, [countryState.items]);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([
    { title: "Select", value: "" },
  ]);
  useEffect(() => {
    let regionselectOpts = [];
    regionselectOpts = countryState.regionItems.map((item) => {
      return {
        title: item.regionName,
        value: item.regionID,
      };
    });
    setfrmRegionSelectOpts([
      { title: "Select", value: "" },
      ...regionselectOpts,
    ]);
  }, [countryState.regionItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState({
      countryName: "",
      regionID: "",
      countryDescription: "",
    });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState({
    countryName: "",
    regionID: "",
    countryDescription: "",
  });

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ countryID: itemid });
    setisEditMode(true);
    setformIntialState({
      countryID: response.countryID,
      countryName: response.countryName,
      regionID: response.regionID,
      countryDescription: response.countryDescription
        ? response.countryDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.countryName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() != item.countryName.toLowerCase()) {
      response = await checkNameExist({
        countryName: item.countryName,
      });
    }
    if (!response) {
      response = await postItem({
        ...item,
        requesterUserId: item.requesterUserId
          ? item.requesterUserId
          : userProfile.userId,
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.country.update);
      }
    } else {
      alert(alertMessage.country.nameExist);
    }
    setisEditMode(false);
    setformIntialState({
      countryName: "",
      regionID: "",
      countryDescription: "",
    });
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      countryName: item.countryName,
    });
    if (!response) {
      response = await postItem({
        ...item,
        requesterUserId: userProfile.userId,
        isActive: true,
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.country.add);
      }
    } else {
      alert(alertMessage.country.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.country.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ countryID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ CountryID: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.country.delete);
      }
    } else {
      alert(alertMessage.country.isInUse);
    }
  };
  return (
    <>
      <div className="page-title">Manage Country</div>
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
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.region === "" && selfilter.country === ""
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
        {countryState.loading ? (
          <Loading />
        ) : countryState.error ? (
          <div>{countryState.error}</div>
        ) : (
          <PaginationData
            id={"countryID"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"+ New Country"}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit Country"}
          frmRegionSelectOpts={frmRegionSelectOpts}
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
  getAll: countryActions.getAll,
  getAllRegions: countryActions.getAllRegions,
  getById: countryActions.getById,
  checkNameExist: countryActions.checkNameExist,
  checkIsInUse: countryActions.checkIsInUse,
  postItem: countryActions.postItem,
  deleteItem: countryActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Country);
