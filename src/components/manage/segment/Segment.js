import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { segmentActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import Dropdown from "../../common-components/Dropdown";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Segment({ ...props }) {
  const { segmentState } = props.state;
  const {
    getAll,
    getAllCountry,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "Segment", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [countryFilterOpts, setcountryFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [segmentFilterOpts, setsegmentFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [selfilter, setselfilter] = useState({
    segment: "",
    country: "",
  });
  const onSearchFilterSelect = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const handleFilterSearch = () => {
    if (selfilter.segment !== "" || selfilter.country !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.segment !== "" &&
          item.segmentID !== selfilter.segment
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
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter({ segment: "", country: "" });
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
            rowid={row.segmentID}
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
            rowid={row.segmentID}
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
      dataField: "segmentName",
      text: "Segment",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "segmentDescription",
      text: "Segment Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "350px" };
      },
    },
    {
      dataField: "countryList",
      text: "Country",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "segmentName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAllCountry();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempsegmentFilterOpts = [];
    let tempCountryFilterOpts = [];
    let tempCountryObj = {};
    segmentState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        tempsegmentFilterOpts.push({
          title: item.segmentName,
          value: item.segmentID,
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
        }
      }
    });
    tempCountryFilterOpts.sort(dynamicSort("title"));
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setsegmentFilterOpts([
      { title: "Select", value: "" },
      ...tempsegmentFilterOpts,
    ]);
    setcountryFilterOpts([
      { title: "Select", value: "" },
      ...tempCountryFilterOpts,
    ]);
  }, [segmentState.items]);

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
  const [countryObj, setcountryObj] = useState({});
  useEffect(() => {
    let countryselectOpts = [];
    let tempCountryObj = {};

    segmentState.countryItems.forEach((item) => {
      countryselectOpts.push({
        title: item.countryName.trim(),
        value: item.countryID,
      });
      tempCountryObj[item.countryID] = item.countryName.trim();
    });
    setfrmCountrySelectOpts([...countryselectOpts]);

    setcountryObj(tempCountryObj);
  }, [segmentState.countryItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState({
      segmentName: "",
      countryList: [],
      segmentDescription: "",
    });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState({
    segmentName: "",
    countryList: [],
    segmentDescription: "",
  });

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ SegmentID: itemid });
    setisEditMode(true);
    setformIntialState({
      segmentID: response.segmentID,
      segmentName: response.segmentName,
      countryList: response.countryList
        ? response.countryList.split(",").map((item) => {
            return {
              title: countryObj[item],
              value: item,
            };
          })
        : [],
      segmentDescription: response.segmentDescription
        ? response.segmentDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.segmentName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() != item.segmentName.toLowerCase()) {
      response = await checkNameExist({
        segmentName: item.segmentName,
      });
    }
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        countryList: tempcountryList,
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
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      segmentName: item.segmentName,
    });
    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        countryList: tempcountryList,
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
    let resonse = await checkIsInUse({ segmentID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ segmentID: itemid });
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
      <div className="page-title">Manage Segment</div>
      <div className="page-filter">
        <div className="dropdown-filter-container">
          <Dropdown
            label={"Segment Name"}
            name={"segment"}
            selectopts={segmentFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.segment}
          />
          <Dropdown
            label={"Country Name"}
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
        {segmentState.loading ? (
          <Loading />
        ) : segmentState.error ? (
          <div>{segmentState.error}</div>
        ) : (
          <PaginationData
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"+ New Segment"}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit Segment"}
          frmCountrySelectOpts={frmCountrySelectOpts}
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
const mapActions = {
  getAll: segmentActions.getAll,
  getAllCountry: segmentActions.getAllCountry,
  getById: segmentActions.getById,
  checkNameExist: segmentActions.checkNameExist,
  checkIsInUse: segmentActions.checkIsInUse,
  postItem: segmentActions.postItem,
  deleteItem: segmentActions.deleteItem,
};
export default connect(null, mapActions)(Segment);
