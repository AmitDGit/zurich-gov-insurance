import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { znaorgnization1Actions, commonActions } from "../../../actions";
import Loading from "../../common-components/Loading";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import FrmSelect from "../../common-components/frmselect/FrmSelect";
import FrmActiveCheckbox from "../../common-components/frmactivecheckbox/FrmActiveCheckbox";
import PaginationData from "../../common-components/PaginationData";
import { alertMessage, dynamicSort } from "../../../helpers";
import AddEditForm from "./AddEditFrom";
function ZNAOrgnization1({ ...props }) {
  const { znaorgnization1State } = props.state;
  const {
    getAll,
    getById,
    checkNameExist,
    checkIsInUse,
    postItem,
    deleteItem,
    userProfile,
    setMasterdataActive,
  } = props;
  useSetNavMenu(
    {
      currentMenu: "znaorganization1",
      isSubmenu: true,
    },
    props.menuClick
  );
  //initialize filter/search functionality
  const [org1FilterOpts, setorg1FilterOpts] = useState([]);
  const intialfilterval = {
    znaSegmentName: "",
    description: "",
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
    if (selfilter.znaSegmentId !== "") {
      let tempdata = [...data];
      tempdata = tempdata.filter((item) => {
        let isShow = true;
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
            name={row.znaSegmentId}
            value={dataActItems.znaSegmentId}
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
          <div
            className="edit-icon"
            onClick={handleEdit}
            rowid={row.znaSegmentId}
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
            rowid={row.znaSegmentId}
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
      dataField: "znaSegmentName",
      text: "ZNA Organization 1",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "250px" };
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
      dataField: "description",
      text: "Description",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "znaSegmentName",
      order: "asc",
    },
  ];
  useEffect(() => {
    getAll({
      RequesterUserId: userProfile.userId,
    });
  }, []);
  useEffect(() => {
    let tempdata = [];
    let tempOrg1FilterOpts = [];
    let initalval = {};
    znaorgnization1State.items.forEach((item) => {
      // if (item.isActive) {
      tempdata.push({
        ...item,
        isActive: item.isActive ? "Active" : "Inactive",
      });
      initalval[item.znaSegmentId] = false;
      tempOrg1FilterOpts.push({
        label: item.znaSegmentName,
        value: item.znaSegmentId,
      });
      // }
    });
    setdata([...tempdata]);
    setpaginationdata([...tempdata]);
    setdataActItems(initalval);
    tempOrg1FilterOpts.sort(dynamicSort("label"));
    setorg1FilterOpts([...tempOrg1FilterOpts]);
  }, [znaorgnization1State.items]);

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
    znaSegmentName: "",
    description: "",
  };
  const [formIntialState, setformIntialState] = useState(initvalstate);

  const [editmodeName, seteditmodeName] = useState("");
  const handleEdit = async (e) => {
    let itemid = e.target.getAttribute("rowid");
    const response = await getById({
      znaSegmentId: itemid,
    });
    setisEditMode(true);
    setformIntialState({
      ...response,
    });
    seteditmodeName(response.znaSegmentName);
    showAddPopup();
  };
  const putItemHandler = async (item) => {
    let response = false;
    if (editmodeName.toLowerCase() !== item.znaSegmentName.toLowerCase()) {
      response = await checkNameExist({
        ZNAFieldName: item.znaSegmentName,
        organisationtype: "org1",
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
      ZNAFieldName: item.znaSegmentName,
      OrganisationType: "org1",
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
      organisationtype: "org1",
    });
    if (!resonse) {
      resonse = await deleteItem({
        id: itemid,
        organisationtype: "org1",
      });
      if (resonse) {
        getAll();
        alert(alertMessage.orgnization1.delete);
      }
    } else {
      alert(alertMessage.orgnization1.isInUse);
    }
  };

  //added below code to set active/inactive state
  const selectedItems = [];
  const [selItemsList, setselItemsList] = useState([]);
  const [isActiveEnable, setisActiveEnable] = useState(false);
  const handleItemSelect = async (e) => {
    let { name, value } = e.target;
    value = e.target.checked;
    setdataActItems({
      ...dataActItems,
      [name]: value,
    });
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
      MasterType: "znaorg1",
      IsActive: state,
    });
    if (response) {
      setselfilter(intialfilterval);
      setselItemsList([]);
      setisActiveEnable(false);
      getAll();
      if (state) {
        alert(alertMessage.commonmsg.masterdataActive);
      } else {
        alert(alertMessage.commonmsg.masterdataInActive);
      }
    }
  };
  return (
    <>
      <div className="page-title">Manage ZNA Organization 1</div>
      <div className="page-filter">
        <div className="filter-container">
          <div className="frm-filter">
            <FrmSelect
              title={"ZNA Organization 1"}
              name={"znaSegmentId"}
              selectopts={org1FilterOpts}
              handleChange={onSearchFilterSelect}
              value={selfilter.znaSegmentId}
            />
          </div>
        </div>
        <div className="btn-container">
          <div
            className={`btn-blue ${
              selfilter.znaSegmentId === "" ? "disable" : ""
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
        {znaorgnization1State.loading ? (
          <Loading />
        ) : znaorgnization1State.error ? (
          <div>{znaorgnization1State.error}</div>
        ) : (
          <PaginationData
            id={"znaSegmentId"}
            column={columns}
            data={paginationdata}
            showAddPopup={showAddPopup}
            defaultSorted={defaultSorted}
            buttonTitle={"ZNA Organization 1"}
            setMasterdataActiveState={setMasterdataActiveState}
            isShowActiveBtns={true}
            ActiveBtnsState={isActiveEnable}
          />
        )}
      </div>
      {isshowAddPopup ? (
        <AddEditForm
          title={"Add/Edit ZNA Organization 1"}
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
  getAll: znaorgnization1Actions.getAll,
  getById: znaorgnization1Actions.getById,
  checkNameExist: znaorgnization1Actions.checkNameExist,
  checkIsInUse: znaorgnization1Actions.checkIsInUse,
  postItem: znaorgnization1Actions.postItem,
  deleteItem: znaorgnization1Actions.deleteItem,
  setMasterdataActive: commonActions.setMasterdataActive,
};
export default connect(mapStateToProp, mapActions)(ZNAOrgnization1);
