import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { lobchapterActions, lobActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Lobchapter({ ...props }) {
  const { lobchapterState, lobState } = props.state;
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
    { currentMenu: "Lobchapter", isSubmenu: true },
    props.menuClick
  );
  //console.log(lobchapterState);
  //initialize filter/search functionality
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const [lobchapterFilterOpts, setlobchapterFilterOpts] = useState([]);
  const intialfilterval = {
    lobchapter: "",
    lob: "",
  };
  const [selfilter, setselfilter] = useState(intialfilterval);
  const onSearchFilterSelect = (name, value) => {
    // const { name, value } = e.target;
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
          width: "70px",
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
      text: "Description",
      sort: false,
      headerStyle: (colum, colIndex) => {
        return { width: "350px" };
      },
    },
    {
      dataField: "lobList",
      text: "LoB",
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
    getAll({ RequesterUserId: userProfile.userId });
    getAllLob();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let templobchapterFilterOpts = [];
    let templobFilterOpts = [];
    let tempLobObj = {};
    lobchapterState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        templobchapterFilterOpts.push({
          label: item.lobChapterName,
          value: item.lobChapterID,
        });
        let coutrylist = item.lobList;

        if (coutrylist) {
          coutrylist = coutrylist.split(",");
          coutrylist.forEach((lobItem) => {
            let tempItem = lobItem.trim();
            if (!tempLobObj[tempItem]) {
              templobFilterOpts.push({
                label: tempItem,
                value: tempItem,
              });
            }
            tempLobObj[tempItem] = tempItem;
          });
        }
      }
    });
    templobchapterFilterOpts.sort(dynamicSort("label"));
    templobFilterOpts.sort(dynamicSort("label"));
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setlobchapterFilterOpts([...templobchapterFilterOpts]);
    setlobFilterOpts([...templobFilterOpts]);
  }, [lobchapterState.items]);

  const [frmLobSelectOpts, setfrmLobSelectOpts] = useState([]);

  const [lobObj, setlobObj] = useState({});

  useEffect(() => {
    let LobSelectOpts = [];
    let tempLobObj = {};
    lobState.lobItems.forEach((item) => {
      LobSelectOpts.push({
        label: item.lobName.trim(),
        value: item.lobid,
      });
      tempLobObj[item.lobid] = item.lobName.trim();
    });
    setfrmLobSelectOpts([{ label: "All", value: "*" }, ...LobSelectOpts]);
    setlobObj(tempLobObj);
  }, [lobState.lobItems]);

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
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ lobChapterID: itemid });
    let selectedlobList = response.lobDataList.map((item) => {
      return { label: item.lobName, value: item.lobid };
    });
    if (selectedlobList.length == frmLobSelectOpts.length - 1) {
      selectedlobList = [...frmLobSelectOpts];
    }
    setisEditMode(true);
    setformIntialState({
      lobChapterID: response.lobChapterID,
      lobChapterName: response.lobChapterName,
      lobList: selectedlobList,
      lobChapterDescription: response.lobChapterDescription
        ? response.lobChapterDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.lobChapterName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() != item.lobChapterName.toLowerCase()) {
      response = await checkNameExist({
        lobChapterName: item.lobChapterName,
      });
    }
    let templobList = item.lobList.map((item) => item.value);
    templobList = templobList.filter((value) => value !== "*");
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
        setselfilter(intialfilterval);
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
    templobList = templobList.filter((value) => value !== "*");
    templobList = templobList.join(",");
    if (!response) {
      response = await postItem({
        ...item,
        lobList: templobList,
        requesterUserId: userProfile.userId,
        isActive: true,
      });

      if (response) {
        setselfilter(intialfilterval);
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
    let resonse = await checkIsInUse({ lobChapterID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ lobChapterID: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.lobchapter.delete);
      }
    } else {
      alert(alertMessage.lobchapter.isInUse);
    }
  };
  return (
    <>
      <div className="page-title">Manage LoB Chapter</div>
      <div className="page-filter">
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"LoB Chapter"}
              name={"lobchapter"}
              selectopts={lobchapterFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.lobchapter}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"LoB"}
              name={"lob"}
              selectopts={lobFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.lob}
            />
          </div>
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
            buttonTitle={"New LoB Chapter"}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit LoB Chapter"}
          frmLobSelectOpts={frmLobSelectOpts}
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
  getAll: lobchapterActions.getAll,
  getAllLob: lobActions.getAlllob,
  getById: lobchapterActions.getById,
  checkNameExist: lobchapterActions.checkNameExist,
  checkIsInUse: lobchapterActions.checkIsInUse,
  postItem: lobchapterActions.postItem,
  deleteItem: lobchapterActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Lobchapter);
