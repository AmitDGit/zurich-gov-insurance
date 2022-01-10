import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { lobchapterActions } from "../../../actions";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import { alertMessage, dynamicSort } from "../../../helpers";
import Dropdown from "../../common-components/Dropdown";
import PaginationData from "../../common-components/PaginationData";
import Loading from "../../common-components/Loading";
function Testcomponent({ ...props }) {
  const { lobchapterState } = props.state;
  const {
    getAll,
    getAllLob,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu(
    {
      currentMenu: "Lobchapter",
      isSubmenu: true,
    },
    props.menuClick
  );
  //initialize filter/search functionality
  const [lobFilterOpts, setlobFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [lobchapterFilterOpts, setlobchapterFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [selfilter, setselfilter] = useState({
    lobchapter: "",
    lob: "",
  });
  const onSearchFilterSelect = (e) => {
    const { name, value } = e.target;
    setselfilter({
      ...selfilter,
      [name]: value,
    });
  };
  const handleFilterSearch = () => {
    if (selfilter.lobchapter !== "" || selfilter.lob !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.lobchapter !== "" &&
          item.lobChapterID !== selfilter.lobchapter
        ) {
          isShow = false;
        }
        if (
          (isShow &&
            selfilter.lob !== "" &&
            item.lobList &&
            !item.lobList.includes(selfilter.lob)) ||
          (isShow && selfilter.lob !== "" && !item.lobList)
        ) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter({
      lobchapter: "",
      lob: "",
    });
    setpaginationdata(data);
  };
  useEffect(() => {
    getAll({
      RequesterUserId: userProfile.userId,
    });
    getAllLob();
  }, []);

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
            rowid={row.lobChapterID}
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
            rowid={row.lobChapterID}
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
      dataField: "lobChapterName",
      text: "LoB Chapter",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "lobChapterDescription",
      text: "LoB Chapter Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "350px" };
      },
    },
    {
      dataField: "lobList",
      text: "LoBs",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "lobChapterName",
      order: "asc",
    },
  ];
  useEffect(() => {
    let tempdata = [];
    let templobchapterFilterOpts = [];
    let templobFilterOpts = [];
    let tempLobObj = {};
    lobchapterState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        templobchapterFilterOpts.push({
          title: item.lobChapterName,
          value: item.lobChapterID,
        });
        let coutrylist = item.lobList;

        if (coutrylist) {
          coutrylist = coutrylist.split(",");
          coutrylist.forEach((lobItem) => {
            let tempItem = lobItem.trim();
            if (!tempLobObj[tempItem]) {
              templobFilterOpts.push({
                title: tempItem,
                value: tempItem,
              });
            }
            tempLobObj[tempItem] = tempItem;
          });
        }
      }
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setlobchapterFilterOpts([
      { title: "Select", value: "" },
      ...templobchapterFilterOpts,
    ]);
    setlobFilterOpts([{ title: "Select", value: "" }, ...templobFilterOpts]);
  }, [lobchapterState.items]);

  const [frmLobSelectOpts, setfrmLobSelectOpts] = useState([]);

  const [lobObj, setlobObj] = useState({});

  useEffect(() => {
    let LobSelectOpts = [];
    let tempLobObj = {};
    lobchapterState.lobsItems.forEach((item) => {
      LobSelectOpts.push({
        title: item.lobName.trim(),
        value: item.lobid,
      });
      tempLobObj[item.lobid] = item.lobName.trim();
    });
    setfrmLobSelectOpts([...LobSelectOpts]);
    setlobObj(tempLobObj);
  }, [lobchapterState.lobsItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState({
      lobChapterName: "",
      lobList: [],
      lobChapterDescription: "",
    });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState({
    lobChapterName: "",
    lobList: [],
    lobChapterDescription: "",
  });

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    console.log(frmLobSelectOpts);
    let itemid = e.target.getAttribute("rowid");
    /* debugger;
    const response = await getById({
      lobChapterID: itemid,
    });
    let tempLobList = response.lobList ? response.lobList.split(",") : [];
    debugger;
    let lobList = [];
    if (tempLobList.length) {
      frmLobSelectOpts.forEach((lobItem) => {
        tempLobList.forEach((item) => {
          if (item.trim() === lobItem.value) {
            lobList.push(lobItem);
          }
        });
      });
    }

    setisEditMode(true);
    setformIntialState({
      lobChapterID: response.lobChapterID,
      lobChapterName: response.lobChapterName,
      lobList: lobList,
      lobChapterDescription: response.lobChapterDescription
        ? response.lobChapterDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.lobChapterName);
    showAddPopup();*/
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() != item.lobChapterName.toLowerCase()) {
      response = await checkNameExist({
        lobChapterName: item.lobChapterName,
      });
    }
    let templobList = item.lobList.map((item) => item.value);
    templobList = templobList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        lobList: templobList,
        requesterUserId: item.requesterUserId
          ? item.requesterUserId
          : userProfile.userId,
      });
      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.lobchapter.update);
      }
    } else {
      alert(alertMessage.lobchapter.nameExist);
    }
    setisEditMode(false);
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      lobChapterName: item.lobChapterName,
    });
    let templobList = item.lobList.map((item) => item.value);
    templobList = templobList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        lobList: templobList,
        requesterUserId: userProfile.userId,
        isActive: true,
      });

      if (response) {
        getAll();
        hideAddPopup();
        alert(alertMessage.lobchapter.add);
      }
    } else {
      alert(alertMessage.lobchapter.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.lobchapter.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      lobChapterID: itemid,
    });
    if (!resonse) {
      resonse = await deleteItem({
        lobChapterID: itemid,
      });
      if (resonse) {
        getAll();
        alert(alertMessage.lobchapter.delete);
      }
    } else {
      alert(alertMessage.lobchapter.isInUse);
    }
  };
  const handleClick = () => {
    console.log(lobchapterState);
  };
  return (
    <div>
      Dashboard Page
      <button onClick={(e) => handleEdit(e)}>click</button>
      <>
        <div className="page-title">Manage LoB Chapter</div>
        <div className="page-filter">
          <div className="dropdown-filter-container">
            <Dropdown
              label={"LoB Chapter Name"}
              name={"lobchapter"}
              selectopts={lobchapterFilterOpts}
              onSelectHandler={onSearchFilterSelect}
              initvalue={selfilter.lobchapter}
            />
            <Dropdown
              label={"LoB Name"}
              name={"lob"}
              selectopts={lobFilterOpts}
              onSelectHandler={onSearchFilterSelect}
              initvalue={selfilter.lob}
            />
          </div>
          <div className="btn-container">
            <div
              className={`btn-blue ${
                selfilter.lobchapter === "" && selfilter.lob === ""
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
          {lobchapterState.loading ? (
            <Loading />
          ) : lobchapterState.error ? (
            <div>{lobchapterState.error}</div>
          ) : (
            <PaginationData
              id={"lobChapterID"}
              column={columns}
              data={paginationdata}
              showAddPopup={showAddPopup}
              defaultSorted={defaultSorted}
              buttonTitle={"+ New LoB Chapter"}
            />
          )}
        </div>
      </>
    </div>
  );
}
const mapStateToProp = (state) => {
  return {
    state: state,
  };
};
const mapActions = {
  getAll: lobchapterActions.getAll,
  getAllLob: lobchapterActions.getAllLob,
  getById: lobchapterActions.getById,
  checkNameExist: lobchapterActions.checkNameExist,
  checkIsInUse: lobchapterActions.checkIsInUse,
  postItem: lobchapterActions.postItem,
  deleteItem: lobchapterActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Testcomponent);
