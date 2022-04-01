import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { segmentActions, countryActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Segment({ ...props }) {
  const { segmentState, countryState } = props.state;
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
  const [countryFilterOpts, setcountryFilterOpts] = useState([]);
  const [segmentFilterOpts, setsegmentFilterOpts] = useState([]);
  const intialfilterval = {
    segment: "",
    country: "",
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
    setselfilter(intialfilterval);
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
          width: "70px",
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
      text: "Description",
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
          label: item.segmentName,
          value: item.segmentID,
        });
        let coutrylist = item.countryList;
        if (coutrylist) {
          coutrylist = coutrylist.split(",");
          coutrylist.forEach((countryItem) => {
            let tempItem = countryItem.trim();
            if (!tempCountryObj[tempItem]) {
              tempCountryFilterOpts.push({
                label: tempItem,
                value: tempItem,
              });
            }
            tempCountryObj[tempItem] = tempItem;
          });
        }
      }
    });
    tempsegmentFilterOpts.sort(dynamicSort("label"));
    tempCountryFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setsegmentFilterOpts([...tempsegmentFilterOpts]);
    setcountryFilterOpts([...tempCountryFilterOpts]);
  }, [segmentState.items]);

  const [frmCountrySelectOpts, setfrmCountrySelectOpts] = useState([]);
  const [countryObj, setcountryObj] = useState({});
  useEffect(() => {
    let countryselectOpts = [];
    let tempCountryObj = {};

    countryState.countryItems.forEach((item) => {
      countryselectOpts.push({
        label: item.countryName.trim(),
        value: item.countryID,
      });
      tempCountryObj[item.countryID] = item.countryName.trim();
    });
    setfrmCountrySelectOpts([
      { label: "All", value: "*" },
      ...countryselectOpts,
    ]);

    setcountryObj(tempCountryObj);
  }, [countryState.countryItems]);

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
    debugger;
    let selectedCountryList = [];
    if (response.segmentCountryList) {
      selectedCountryList = response.segmentCountryList.map((item) => {
        return {
          label: item.countryName,
          value: item.countryID,
        };
      });
    }
    if (
      selectedCountryList.length &&
      selectedCountryList.length == frmCountrySelectOpts.length - 1
    ) {
      selectedCountryList = [
        { label: "All", value: "*" },
        ...selectedCountryList,
      ];
    }
    setisEditMode(true);
    setformIntialState({
      segmentID: response.segmentID,
      segmentName: response.segmentName,
      countryList: selectedCountryList,
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
    tempcountryList = tempcountryList.filter((value) => value !== "*");
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
        alert(alertMessage.segment.update);
      }
    } else {
      alert(alertMessage.segment.nameExist);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      segmentName: item.segmentName,
    });

    let tempcountryList = item.countryList.map((item) => item.value);
    tempcountryList = tempcountryList.filter((value) => value !== "*");
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
        alert(alertMessage.segment.add);
      }
    } else {
      alert(alertMessage.segment.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.segment.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ segmentID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ segmentID: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.segment.delete);
      }
    } else {
      alert(alertMessage.segment.isInUse);
    }
  };
  return (
    <>
      <div className="page-title">Manage Segment</div>
      <div className="page-filter">
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"Segment"}
              name={"segment"}
              selectopts={segmentFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.segment}
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
              selfilter.segment === "" && selfilter.country === ""
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
            id={"segmentID"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Segment"}
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
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: segmentActions.getAll,
  getAllCountry: countryActions.getAllCountry,
  getById: segmentActions.getById,
  checkNameExist: segmentActions.checkNameExist,
  checkIsInUse: segmentActions.checkIsInUse,
  postItem: segmentActions.postItem,
  deleteItem: segmentActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Segment);
