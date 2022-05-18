import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { regionActions, commonActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import AddEditForm from "./AddEditForm";
import Loading from "../../common-components/Loading";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
function Region({ ...props }) {
  const { regionState } = props.state;
  const {
    getAllRegions,
    postItem,
    deleteItem,
    getRegionById,
    checkRegionExist,
    checkRegionInUse,
    userProfile,
    setMasterdataActive,
  } = props;
  useSetNavMenu({ currentMenu: "Region", isSubmenu: true }, props.menuClick);
  //console.log(regionState);
  //initialize filter/search functionality
  const [regionFilterOpts, setregionFilterOpts] = useState([]);
  const intialFilterState = {
    region: "",
  };
  const [selfilter, setselfilter] = useState(intialFilterState);
  const onSearchFilterSelect = (name, value) => {
    setselfilter({ ...selfilter, [name]: value });
  };
  const handleFilterSearch = () => {
    if (selfilter.region !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => selfilter.region === item.id);
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter(intialFilterState);
    setpaginationdata(data);
  };

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
            name={row.id}
            value={dataActItems.id}
            handleChange={handleItemSelect}
            isdisabled={false}
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
          <div className="edit-icon" onClick={handleEdit} rowid={row.id}></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "65px", textAlign: "center" };
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
            rowid={row.id}
          ></div>
        );
      },
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "70px", textAlign: "center" };
      },
      align: "center",
    },
    {
      dataField: "regionID",
      text: "regionID",
      sort: true,
      hidden: true,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "regionName",
      text: "Region",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "180px" };
      },
    },
    {
      dataField: "isActive",
      text: "Active/Inactive",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px" };
      },
    },
    {
      dataField: "regionDescription",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "regionName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAllRegions();
  }, []);

  useEffect(() => {
    let tempdata = [];
    let tempFilterOpts = [];
    let initalval = {};
    regionState.items.forEach((item) => {
      //if (item.isActive) {
      let tempItem = {
        ...item,
        id: item.regionID,
        isActive: item.isActive ? "Active" : "Inactive",
      };
      initalval[tempItem.id] = false;
      tempdata.push(tempItem);
      tempFilterOpts.push({
        label: item.regionName,
        value: item.regionID,
      });

      //}
    });
    tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setregionFilterOpts([...tempFilterOpts]);
    setdataActItems(initalval);
  }, [regionState.items]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);
  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState({
    regionName: "",
    regionDescription: "",
  });
  const [editmodeRegionName, seteditmodeRegionName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getRegionById({ regionID: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
      regionDescription: response.regionDescription
        ? response.regionDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
    });
    seteditmodeRegionName(response.regionName);
    showAddPopup();
  };

  const postItemHandler = async (item) => {
    let response = await checkRegionExist({ RegionName: item.regionName });
    if (!response) {
      response = await postItem({
        ...item,
        requesterUserId: userProfile.userId,
        isActive: true,
      });
      if (response) {
        setselfilter(intialFilterState);
        getAllRegions();
        hideAddPopup();
        alert(alertMessage.region.add);
      }
    } else {
      alert(alertMessage.region.nameExist);
    }
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeRegionName.toLowerCase() !== item.regionName.toLowerCase()) {
      response = await checkRegionExist({ RegionName: item.regionName });
    }
    if (!response) {
      response = await postItem({
        ...item,
        requesterUserId: userProfile.userId,
      });
      if (response) {
        setselfilter(intialFilterState);
        getAllRegions();
        hideAddPopup();
        alert(alertMessage.region.update);
      }
    } else {
      alert(alertMessage.region.nameExist);
    }
    setisEditMode(false);
    setformIntialState({
      regionName: "",
      regionDescription: "",
    });
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.region.deleteConfirm)) {
      return;
    }
    let resonse = await checkRegionInUse({ regionID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ regionID: itemid });
      if (resonse) {
        getAllRegions();
        alert(alertMessage.region.delete);
      }
    } else {
      alert(alertMessage.region.isInUse);
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
      MasterType: "region",
      IsActive: state,
    });
    if (response) {
      setselfilter(intialFilterState);
      setselItemsList([]);
      setisActiveEnable(false);
      getAllRegions();
      if (state) {
        alert(alertMessage.commonmsg.masterdataActive);
      } else {
        alert(alertMessage.commonmsg.masterdataInActive);
      }
    }
  };
  return (
    <>
      <div className="page-title">Manage Region</div>
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
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${selfilter.region === "" ? "disable" : ""}`}
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
        {regionState.loading ? (
          <Loading />
        ) : regionState.error ? (
          <div>{regionState.error}</div>
        ) : (
          <PaginationData
            id={"id"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Region"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
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
  getAllRegions: regionActions.getAll,
  postItem: regionActions.postItem,
  deleteItem: regionActions.deleteItem,
  getRegionById: regionActions.getById,
  checkRegionExist: regionActions.checkRegionExist,
  checkRegionInUse: regionActions.checkRegionInUse,
  setMasterdataActive: commonActions.setMasterdataActive,
};
export default connect(mapStateToProp, mapActions)(Region);
