import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { regionActions } from "../../../actions/region.action";
import useSetNavMenu from "../../../customhooks/useSetNavMenu";
import Dropdown from "../../common-components/Dropdown";
import Regionview from "./Regionview";
function Region({ ...props }) {
  const { regionState } = props.state;
  const { getAllRegions } = props;
  const [regionFilterOpts, setregionFilterOpts] = useState([
    { title: "Select", value: "" },
    { title: "Option 1", value: "Option 1" },
    { title: "Option 2", value: "Option 2" },
    { title: "Option 3", value: "Option 3" },
  ]);
  const [data, setdata] = useState([]);
  const [paginationsizeperpage, setpaginationsizeperpage] = useState(10);
  const columns = [
    {
      dataField: "id",
      text: "Album ID",
      sort: true,
      hidden: false,
      headerStyle: (colum, colIndex) => {
        return { width: "150px", textAlign: "left" };
      },
    },
    {
      dataField: "title",
      text: "Album Name",
      sort: true,
    },
    {
      dataField: "action",
      text: "Edit",
      formatter: rankFormatter,
      sort: false,
    },
  ];
  function rankFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <div onClick={handleEdit} rowId={row.id}>
        Edit
      </div>
    );
  }
  useSetNavMenu({ currentMenu: "Region", isSubmenu: true }, props.menuClick);
  useEffect(() => {
    getAllRegions();
  }, []);
  useEffect(() => {
    const data = regionState.items.map((item) => ({
      id: item.id,
      title: item.title,
      action: "",
    }));
    setdata(data);
  }, [regionState.items]);
  const handleEdit = (e) => {
    console.log(`clicked ${e.target.attributes.getNamedItem("rowid").value}`);
  };
  console.log(regionState);
  return (
    <>
      <div className="page-title">Manage Region</div>
      <div className="page-filter">
        <div className="dropdown-filter-container">
          <Dropdown label={"Region Name"} selectopts={regionFilterOpts} />
        </div>
        <div className="btn-container">
          <div className="btn-blue">Search</div>
          <div className="btn-blue">Clear</div>
        </div>
      </div>
      <div>
        {regionState.loading ? (
          <div>Loading...</div>
        ) : regionState.error ? (
          <div>{regionState.error}</div>
        ) : (
          <Regionview
            column={columns}
            data={data}
            sizeperpage={paginationsizeperpage}
          />
        )}
      </div>
    </>
  );
}
const mapActions = {
  getAllRegions: regionActions.getAll,
};
export default connect(null, mapActions)(Region);
