import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { regionActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";

import FrmSelect from "../../common-components/frmselect/FrmSelect";
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
  const [data, setdata] = useState([]);
  const [paginationdata, setpaginationdata] = useState([]);
  const columns = [
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
        return { width: "50px", textAlign: "center" };
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
        return { width: "250px" };
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
    regionState.items.forEach((item) => {
      if (item.isActive) {
        let tempItem = {
          id: item.regionID,
          regionName: item.regionName,
          regionDescription: item.regionDescription,
          editaction: "",
          deleteaction: "",
        };
        tempdata.push(tempItem);
        tempFilterOpts.push({
          label: item.regionName,
          value: item.regionID,
        });
      }
    });
    tempFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setregionFilterOpts([...tempFilterOpts]);
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
      regionID: response.regionID,
      regionName: response.regionName,
      regionDescription: response.regionDescription
        ? response.regionDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
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
    if (editmodeRegionName.toLowerCase() != item.regionName.toLowerCase()) {
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
};
export default connect(mapStateToProp, mapActions)(Region);
