import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { countryActions, regionActions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Country({ ...props }) {
  const { countryState, regionState } = props.state;
  const {
    getAll,
    getAllRegions,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
  } = props;
  useSetNavMenu({ currentMenu: "Country", isSubmenu: true }, props.menuClick);

  const [frmRegionSelectOpts, setfrmRegionSelectOpts] = useState([]);
  const [frmRegionSelectOptObj, setfrmRegionSelectOptObj] = useState({});
  //initialize filter/search functionality
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [countryFilterAllOpts, setcountryFilterAllOpts] = useState([]);
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const [countrymapping, setcountrymapping] = useState([]);
  const intialfilterval = {
    country: "",
    region: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const onSearchFilterSelect = (name, value) => {
    //const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
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
        if (item.region === selfilter.region) {
          return item;
        }
      });
      setcountryFilterOpts([
        ...tempFilterOpts[0].country.sort(dynamicSort("label")),
      ]);
    } else {
      setcountryFilterOpts([...countryFilterAllOpts]);
    }
    setselfilter({
      ...selfilter,
      country: "",
    });
  }, [selfilter.region]);
  //set pagination data and functionality
  const [dataActItems, setdataActItems] = useState({});
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);

  const columns = [
    {
      dataField: "checkbox",
      text: "",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <FrmActiveCheckbox
            name={row.countryID}
            value={dataActItems.countryID}
            handleChange={handleItemSelect}
            isdisabled={!row.isActiveEnable}
          />
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "40px", textAlign: "center" };
      },
    },
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
          width: "70px",
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
        return { width: "200px" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "200px" };
      },
    },
    {
      dataField: "isActive",
      text: "Active/Inactive",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>{row.isActive ? "Active" : "Inactive"}</span>;
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
    fnOnInit();
  }, []);

  const fnOnInit = async () => {
    let regionselectOpts = await getAllRegions();
    let tempObj = {};
    let tempOpts = [];
    regionselectOpts.forEach((item) => {
      tempOpts.push({
        ...item,
        label: item.regionName,
        value: item.regionID,
      });
      tempObj[item.regionID] = item;
    });
    setfrmRegionSelectOpts([...tempOpts]);
    setfrmRegionSelectOptObj({ ...tempObj });
    getAll({ RequesterUserId: userProfile.userId });
  };
  useEffect(() => {
    let tempdata = [];
    let tempCountryFilterOpts = [];
    let tempRegionFilterOpts = [];
    let tempRegionListObj = {};
    let tempCountryMapping = [];
    let initalval = {};
    countryState.items.forEach((item) => {
      //if (item.isActive) {
      tempdata.push({
        ...item,
        isActiveEnable: frmRegionSelectOptObj[item.regionID]
          ? frmRegionSelectOptObj[item.regionID]["isActive"]
          : true,
      });
      initalval[tempdata.countryID] = false;
      tempCountryFilterOpts.push({
        label: item.countryName,
        value: item.countryID,
      });
      if (!tempRegionListObj[item.regionID]) {
        tempRegionFilterOpts.push({
          label: item.regionName,
          value: item.regionID,
        });
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
      tempRegionListObj[item.regionID] = item.regionName;
      //}
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    tempCountryFilterOpts.sort(dynamicSort("label"));
    tempRegionFilterOpts.sort(dynamicSort("label"));
    setcountryFilterOpts([...tempCountryFilterOpts]);
    setcountryFilterAllOpts([...tempCountryFilterOpts]);
    setregionFilterOpts([...tempRegionFilterOpts]);
    setcountrymapping([...tempCountryMapping]);
  }, [countryState.items]);

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
      isActiveEnable: frmRegionSelectOptObj[response.regionID]
        ? frmRegionSelectOptObj[response.regionID]["isActive"]
        : true,
    });
    seteditmodeName(response.countryName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.countryName.toLowerCase()) {
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
        setselfilter(intialfilterval);
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
        setselfilter(intialfilterval);
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

  //added below code to set active/inactive state
  const selectedItems = [];
  const [selItemsList, setselItemsList] = useState([]);
  const [isActiveEnable, setisActiveEnable] = useState(false);
  const handleItemSelect = async (e) => {
    let { name, value } = e.target;
    value = e.target.checked;
    setdataActItems({ ...dataActItems, [name]: value });
    if (value && !selectedItems.includes(name)) {
      selectedItems.push(name);
    } else {
      const index = selectedItems.indexOf(name);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }
    if (selectedItems.length) {
      setisActiveEnable(true);
      setselItemsList([...selectedItems]);
    } else {
      setisActiveEnable(false);
    }
  };

  const setMasterdataActiveState = async (state) => {
    let response = await setMasterdataActive({
      TempId: selItemsList.join(","),
      MasterType: "country",
      IsActive: state,
    });
    if (response) {
      setselfilter(intialfilterval);
      getAll();
      setselItemsList([]);
      setisActiveEnable(false);
      if (state) {
        alert(alertMessage.commonmsg.masterdataActive);
      } else {
        alert(alertMessage.commonmsg.masterdataInActive);
      }
    }
  };

  return (
    <>
      <div className="page-title">Manage Country</div>
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
            buttonTitle={"New Country"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
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
  getAllRegions: regionActions.getAllRegions,
  getById: countryActions.getById,
  checkNameExist: countryActions.checkNameExist,
  checkIsInUse: countryActions.checkIsInUse,
  postItem: countryActions.postItem,
  deleteItem: countryActions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
};
export default connect(mapStateToProp, mapActions)(Country);
