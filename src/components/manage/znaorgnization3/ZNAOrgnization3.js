import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  znaorgnization1Actions,
  znaorgnization2Actions,
  znaorgnization3Actions,
} from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function ZNAOrgnization3({ ...props }) {
  const {
    znaorgnization1State,
    znaorgnization2State,
    znaorgnization3State,
  } = props.state;
  const {
    getAll,
    getAllOrgnization1,
    getAllOrgnization2,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
  } = props;
  useSetNavMenu(
    { currentMenu: "znaorganization3", isSubmenu: true },
    props.menuClick
  );
  console.log(znaorgnization3State);
  //initialize filter/search functionality
  const [org1FilterOpts, setorg1FilterOpts] = useState([]);
  const [org2FilterOpts, setorg2FilterOpts] = useState([]);
  const [org2FilterOptsAllOpts, setorg2FilterOptsAllOpts] = useState([]);
  const [org3FilterOpts, setorg3FilterOpts] = useState([]);
  const [org3FilterOptsAllOpts, setorg3FilterOptsAllOpts] = useState([]);
  const selectInitiVal = {
    label: "Select",
    value: "",
  };
  const intialfilterval = {
    znasbuId: "",
    marketBasketId: "",
    znaSegmentId: "",
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
    if (
      selfilter.znasbuId !== "" ||
      selfilter.marketBasketId !== "" ||
      selfilter.znaSegmentId !== ""
    ) {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
        if (
          isShow &&
          selfilter.znasbuId !== "" &&
          item.znasbuId !== selfilter.znasbuId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.marketBasketId !== "" &&
          item.marketBasketId !== selfilter.marketBasketId
        ) {
          isShow = false;
        }
        if (
          isShow &&
          selfilter.znaSegmentId !== "" &&
          item.znaSegmentId !== selfilter.znaSegmentId
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
    if (selfilter.znasbuId !== "") {
      let tempFilterOpts = org3FilterOptsAllOpts.filter(
        (item) => item.znasbuId === selfilter.znasbuId
      );
      setorg3FilterOpts([...tempFilterOpts.sort(dynamicSort("label"))]);
    } else {
      setorg3FilterOpts([...org3FilterOptsAllOpts]);
    }
    setselfilter({
      ...selfilter,
      marketBasketId: "",
    });
  }, [selfilter.znasbuId]);

  useEffect(() => {
    if (selfilter.znaSegmentId !== "") {
      let tempFilterOpts = org2FilterOptsAllOpts.filter(
        (item) => item.znaSegmentId === selfilter.znaSegmentId
      );
      setorg2FilterOpts([...tempFilterOpts.sort(dynamicSort("label"))]);
    } else {
      setorg2FilterOpts([...org2FilterOptsAllOpts]);
    }
    setselfilter({
      ...selfilter,
      marketBasketId: "",
      znasbuId: "",
    });
  }, [selfilter.znaSegmentId]);
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
            rowid={row.marketBasketId}
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
    },
    {
      dataField: "deleteaction",
      text: "Delete",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return (
          <div
            className="delete-icon"
            onClick={handleDelete}
            rowid={row.marketBasketId}
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
      dataField: "marketBasketName",
      text: "Organization 3",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "sbuName",
      text: "Organization 2",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "znaSegmentName",
      text: "Organization 1",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
      },
    },
    {
      dataField: "description",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "marketBasketName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({ createdById: userProfile.userId });
    getAllOrgnization1({ createdById: userProfile.userId });
    getAllOrgnization2({ createdById: userProfile.userId });
  }, []);
  useEffect(() => {
    let tempdata = [];
    let temporg3FilterOpts = [];
    let temporg2FilterOpts = [];
    let tempOrg2ListObj = {};
    let temporg1FilterOpts = [];
    let tempOrg1ListObj = {};
    znaorgnization3State.items.forEach((item) => {
      if (item.isActive) {
        tempdata.push(item);
        temporg3FilterOpts.push({
          label: item.marketBasketName,
          value: item.marketBasketId,
          znasbuId: item.znasbuId,
        });
        if (!tempOrg2ListObj[item.znasbuId]) {
          temporg2FilterOpts.push({
            label: item.sbuName,
            value: item.znasbuId,
            znaSegmentId: item.znaSegmentId,
          });
        }
        tempOrg2ListObj[item.znasbuId] = item.sbuName;
        if (!tempOrg1ListObj[item.znaSegmentId]) {
          temporg1FilterOpts.push({
            label: item.znaSegmentName,
            value: item.znaSegmentId,
          });
        }
        tempOrg1ListObj[item.znaSegmentId] = item.znaSegmentName;
      }
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    temporg3FilterOpts.sort(dynamicSort("label"));
    temporg2FilterOpts.sort(dynamicSort("label"));
    temporg1FilterOpts.sort(dynamicSort("label"));
    setorg3FilterOpts([...temporg3FilterOpts]);
    setorg3FilterOptsAllOpts([...temporg3FilterOpts]);
    setorg2FilterOpts([...temporg2FilterOpts]);
    setorg2FilterOptsAllOpts([...temporg2FilterOpts]);
    setorg1FilterOpts([...temporg1FilterOpts]);
  }, [znaorgnization3State.items]);

  const [frmOrg1SelectOpts, setfrmOrg1SelectOpts] = useState([]);
  useEffect(() => {
    let tempOpts = [];
    tempOpts = znaorgnization1State.org1Items.map((item) => {
      return {
        label: item.znaSegmentName,
        value: item.znaSegmentId,
      };
    });
    setfrmOrg1SelectOpts([selectInitiVal, ...tempOpts]);
  }, [znaorgnization1State.org1Items]);

  const [frmOrg2SelectOpts, setfrmOrg2SelectOpts] = useState([]);
  useEffect(() => {
    let tempOpts = [];
    tempOpts = znaorgnization2State.org2Items.map((item) => {
      return {
        label: item.sbuName,
        value: item.znasbuId,
        znaSegmentId: item.znaSegmentId,
      };
    });
    setfrmOrg2SelectOpts([...tempOpts]);
  }, [znaorgnization2State.org2Items]);

  /* Add Edit Delete functionality & show popup*/

  const [isshowAddPopup, setshowAddPopup] = useState(false);

  const showAddPopup = () => {
    setshowAddPopup(true);
  };
  const hideAddPopup = () => {
    setshowAddPopup(false);
    setformIntialState(initvalstate);
  };
  const [isEditMode, setisEditMode] = useState(false);
  const initvalstate = {
    marketBasketName: "",
    znasbuId: "",
    description: "",
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({ marketBasketId: itemid });
    setisEditMode(true);
    setformIntialState({
      ...response,
    });
    seteditmodeName(response.marketBasketName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.marketBasketName.toLowerCase()) {
      response = await checkNameExist({
        ZNAFieldName: item.marketBasketName,
        organisationtype: "org3",
      });
    }
    if (!response) {
      response = await postItem({
        ...item,
        createdById: item.createdById ? item.createdById : userProfile.userId,
      });
      if (response) {
        setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.orgnization1.update);
      }
    } else {
      alert(alertMessage.orgnization1.nameExist);
    }
    setisEditMode(false);
    setformIntialState(initvalstate);
  };
  const postItemHandler = async (item) => {
    let response;
    response = await checkNameExist({
      ZNAFieldName: item.marketBasketName,
      OrganisationType: "org3",
    });
    if (!response) {
      response = await postItem({
        ...item,
        createdById: userProfile.userId,
        isActive: true,
      });
      if (response) {
        setselfilter(intialfilterval);
        getAll();
        hideAddPopup();
        alert(alertMessage.orgnization1.add);
      }
    } else {
      alert(alertMessage.orgnization1.nameExist);
    }
  };
  const handleDelete = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    if (!window.confirm(alertMessage.orgnization1.deleteConfirm)) {
      return;
    }
    let resonse = await checkIsInUse({
      id: itemid,
      organisationtype: "org3",
    });
    if (!resonse) {
      resonse = await deleteItem({
        id: itemid,
        organisationtype: "org3",
      });
      if (resonse) {
        getAll();
        alert(alertMessage.orgnization1.delete);
      }
    } else {
      alert(alertMessage.orgnization1.isInUse);
    }
  };
  return (
    <>
      <div className="page-title">Manage Organization 3</div>
      <div className="page-filter">
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"Organization 1"}
              name={"znaSegmentId"}
              selectopts={org1FilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.znaSegmentId}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"Organization 2"}
              name={"znasbuId"}
              selectopts={org2FilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.znasbuId}
            />
          </div>
          <div className="frm-filter">
            <FrmSelect
              title={"Organization 3"}
              name={"marketBasketId"}
              selectopts={org3FilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.marketBasketId}
            />
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.marketBasketId === "" &&
              selfilter.znasbuId === "" &&
              selfilter.znaSegmentId === ""
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
        {znaorgnization3State.loading ? (
          <Loading />
        ) : znaorgnization3State.error ? (
          <div>{znaorgnization3State.error}</div>
        ) : (
          <PaginationData
            id={"marketBasketId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"ZNA Organization 3"}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit ZNA Organization 3"}
          hideAddPopup={hideAddPopup}
          postItem={postItemHandler}
          putItem={putItemHandler}
          isEditMode={isEditMode}
          formIntialState={formIntialState}
          frmOrg1SelectOpts={frmOrg1SelectOpts}
          frmOrg2SelectOpts={frmOrg2SelectOpts}
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
  getAll: znaorgnization3Actions.getAll,
  getById: znaorgnization3Actions.getById,
  checkNameExist: znaorgnization3Actions.checkNameExist,
  checkIsInUse: znaorgnization3Actions.checkIsInUse,
  postItem: znaorgnization3Actions.postItem,
  deleteItem: znaorgnization3Actions.deleteItem,
  getAllOrgnization1: znaorgnization1Actions.getAllOrgnization,
  getAllOrgnization2: znaorgnization2Actions.getAllOrgnization,
};
export default connect(mapStateToProp, mapActions)(ZNAOrgnization3);
