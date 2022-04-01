import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { sublobActions, lobActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function Sublob({ ...props }) {
  const { sublobState, lobState } = props.state;
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
  const [sublobFilterOpts, setsublobFilterOpts] = useState([]);
  const [sublobFilterAllOpts, setsublobFilterAllOpts] = useState([]);
  const [lobFilterOpts, setlobFilterOpts] = useState([]);
  const [lobmapping, setlobmapping] = useState([]);
  const intialfilterval = {
    sublob: "",
    lob: "",
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
    setselfilter(intialfilterval);
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
        ...tempsublobFilterOpts[0].sublob.sort(dynamicSort("label")),
      ]);
    } else {
      setsublobFilterOpts([...sublobFilterAllOpts]);
    }
  }, [selfilter.lob]);
  //set pagination data and functionality
  const [datapagesize, setdatapagesize] = useState(500);
  const [datapageindex, setdatapageindex] = useState(1);
  const [datatotalcount, setdatatotalcount] = useState(0);
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
          width: "70px",
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
    getAll({
      RequesterUserId: userProfile.userId,
      //PageIndex: datapageindex,
      //PageSize: datapagesize,
    });
    getAlllob();
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempsublobFilterOpts = [];
    let templobFilterOpts = [];
    let tempLobListObj = {};
    let tempLobMapping = [];
    if (sublobState.items.length) {
      setdatatotalcount(parseInt(sublobState.items[0].totalCount));
    }
    sublobState.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        tempsublobFilterOpts.push({
          label: item.subLOBName,
          value: item.subLOBID,
        });
        if (!tempLobListObj[item.lobid]) {
          tempLobMapping.push({
            lob: item.lobid,
            sublob: [
              {
                label: item.subLOBName,
                value: item.subLOBID,
              },
            ],
          });
          templobFilterOpts.push({
            label: item.lobName,
            value: item.lobid,
          });
        } else {
          tempLobMapping.forEach((lobitem) => {
            if (lobitem.lob === item.lobid) {
              lobitem.sublob.push({
                label: item.subLOBName,
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
    tempsublobFilterOpts.sort(dynamicSort("label"));
    templobFilterOpts.sort(dynamicSort("label"));
    setsublobFilterOpts([...tempsublobFilterOpts]);
    setsublobFilterAllOpts([...tempsublobFilterOpts]);
    setlobFilterOpts([...templobFilterOpts]);
    setlobmapping([...tempLobMapping]);
  }, [sublobState.items]);

  const [frmLobSelectOpts, setfrmLobSelectOpts] = useState([]);
  useEffect(() => {
    let lobselectOpts = [];
    lobselectOpts = lobState.lobItems.map((item) => {
      return {
        label: item.lobName,
        value: item.lobid,
      };
    });
    lobselectOpts.sort(dynamicSort("label"));
    setfrmLobSelectOpts([...lobselectOpts]);
  }, [lobState.lobItems]);

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
        setselfilter(intialfilterval);
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
        setselfilter(intialfilterval);
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
          <div className="frm-filter">
            <FrmSelect
              title={"LoB"}
              name={"lob"}
              selectopts={lobFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.lob}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"Sub-LoB"}
              name={"sublob"}
              selectopts={sublobFilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.sublob}
            />
          </div>
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
            datatotalcount={datatotalcount}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"New Sub-LoB"}
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
  getAlllob: lobActions.getAlllob,
  getById: sublobActions.getById,
  checkNameExist: sublobActions.checkNameExist,
  checkIsInUse: sublobActions.checkIsInUse,
  postItem: sublobActions.postItem,
  deleteItem: sublobActions.deleteItem,
};
export default connect(mapStateToProp, mapActions)(Sublob);
