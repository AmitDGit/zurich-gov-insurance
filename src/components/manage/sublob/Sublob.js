import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { sublobActions } from "../../../actions/sublob.action";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import Dropdown from "../../common-components/Dropdown";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Sublob({ ...props }) {
  const { sublobState } = props.state;
  const {
    getAll,
    getAlllob,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu({ currentMenu: "Sublob", isSubmenu: true }, props.menuClick);
  //initialize filter/search functionality
  const [sublobFilterOpts, setsublobFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [sublobFilterAllOpts, setsublobFilterAllOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [lobFilterOpts, setlobFilterOpts] = useState([
    { title: "Select", value: "" },
  ]);
  const [lobmapping, setlobmapping] = useState([]);
  const [selfilter, setselfilter] = useState({
    sublob: "",
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
    if (selfilter.sublob !== "" || selfilter.lob !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.sublob !== "" &&
          item.subLOBID !== selfilter.sublob
        ) {
          isShow = false;
        }
        if (isShow && selfilter.lob !== "" && item.lobid !== selfilter.lob) {
          isShow = false;
        }
        return isShow;
      });
      setpaginationdata(tempdata);
    }
  };
  const clearFilter = () => {
    setselfilter({ sublob: "", lob: "" });
    setpaginationdata(data);
  };
  useEffect(() => {
    if (selfilter.lob !== "") {
      let tempsublobFilterOpts = lobmapping.filter((item) => {
        if (item.lob == selfilter.lob) {
          return item;
        }
      });
      setsublobFilterOpts([
        { title: "Select", value: "" },
        ...tempsublobFilterOpts[0].sublob.sort(dynamicSort("title")),
      ]);
    } else {
      setsublobFilterOpts([...sublobFilterAllOpts]);
    }
  }, [selfilter.lob]);
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
            rowid={row.subLOBID}
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
            rowid={row.subLOBID}
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
      dataField: "subLOBName",
      text: "Sub-LoB",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "lobName",
      text: "LoB",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "subLOBDescription",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "subLOBName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({ RequesterUserId: userProfile.userId });
    getAlllob();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempsublobFilterOpts = [];
    let templobFilterOpts = [];
    let tempLobListObj = {};
    let tempLobMapping = [];
    sublobState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        tempsublobFilterOpts.push({
          title: item.subLOBName,
          value: item.subLOBID,
        });
        if (!tempLobListObj[item.lobid]) {
          tempLobMapping.push({
            lob: item.lobid,
            sublob: [
              {
                title: item.subLOBName,
                value: item.subLOBID,
              },
            ],
          });
          templobFilterOpts.push({
            title: item.lobName,
            value: item.lobid,
          });
        } else {
          tempLobMapping.forEach((lobitem) => {
            if (lobitem.lob === item.lobid) {
              lobitem.sublob.push({
                title: item.subLOBName,
                value: item.subLOBID,
              });
            }
          });
        }
        tempLobListObj[item.lobid] = item.lobName;
      }
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    tempsublobFilterOpts.sort(dynamicSort("title"));
    templobFilterOpts.sort(dynamicSort("title"));
    setsublobFilterOpts([
      { title: "Select", value: "" },
      ...tempsublobFilterOpts,
    ]);
    setsublobFilterAllOpts([
      { title: "Select", value: "" },
      ...tempsublobFilterOpts,
    ]);
    setlobFilterOpts([{ title: "Select", value: "" }, ...templobFilterOpts]);
    setlobmapping([...tempLobMapping]);
  }, [sublobState.items]);

  const [frmLobSelectOpts, setfrmLobSelectOpts] = useState([
    { title: "Select", value: "" },
  ]);
  useEffect(() => {
    let lobselectOpts = [];
    lobselectOpts = sublobState.lobItems.map((item) => {
      return {
        title: item.lobName,
        value: item.lobid,
      };
    });
    lobselectOpts.sort(dynamicSort("title"));
    setfrmLobSelectOpts([{ title: "Select", value: "" }, ...lobselectOpts]);
  }, [sublobState.lobItems]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState({
      subLOBName: "",
      lobid: "",
      subLOBDescription: "",
    });
  };

  const [isEditMode, setisEditMode] = useState(false);
  const [formIntialState, setformIntialState] = useState({
    subLOBName: "",
    lobid: "",
    subLOBDescription: "",
  });

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ subLOBID: itemid });
    setisEditMode(true);
    setformIntialState({
      subLOBID: response.subLOBID,
      subLOBName: response.subLOBName,
      lobid: response.lobid,
      subLOBDescription: response.subLOBDescription
        ? response.subLOBDescription
        : "",
      requesterUserId: response.requesterUserId ? response.requesterUserId : "",
      isActive: response.isActive,
    });
    seteditmodeName(response.subLOBName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() != item.subLOBName.toLowerCase()) {
      response = await checkNameExist({
        subLOBName: item.subLOBName,
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
        alert(alertMessage.sublob.update);
      }
    } else {
      alert(alertMessage.sublob.nameExist);
    }
    setisEditMode(false);
    setformIntialState({
      subLOBName: "",
      lobid: "",
      subLOBDescription: "",
    });
  };
  const postItemHandler = async (item) => {
    let response = await checkNameExist({
      subLOBName: item.subLOBName,
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
        alert(alertMessage.sublob.add);
      }
    } else {
      alert(alertMessage.sublob.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.sublob.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({ subLOBID: itemid });
    if (!resonse) {
      resonse = await deleteItem({ subLOBID: itemid });
      if (resonse) {
        getAll();
        alert(alertMessage.sublob.delete);
      }
    } else {
      alert(alertMessage.sublob.isInUse);
    }
  };
  return (
    <>
      <div className="page-title">Manage Sub-LoB</div>
      <div className="page-filter">
        <div className="filter-container">
          <Dropdown
            label={"LoB"}
            name={"lob"}
            selectopts={lobFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.lob}
          />
          <Dropdown
            label={"Sub-LoB"}
            name={"sublob"}
            selectopts={sublobFilterOpts}
            onSelectHandler={onSearchFilterSelect}
            initvalue={selfilter.sublob}
          />
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.sublob === "" && selfilter.lob === "" ? "disable" : ""
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
        {sublobState.loading ? (
          <Loading />
        ) : sublobState.error ? (
          <div>{sublobState.error}</div>
        ) : (
          <PaginationData
            id={"subLOBID"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"+ New Sub-LoB"}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit Sub-LoB"}
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
  getAll: sublobActions.getAll,
  getAlllob: sublobActions.getAlllob,
  getById: sublobActions.getById,
  checkNameExist: sublobActions.checkNameExist,
  checkIsInUse: sublobActions.checkIsInUse,
  postItem: sublobActions.postItem,
  deleteItem: sublobActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Sublob);
