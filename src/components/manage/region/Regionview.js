import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
function Regionview(props) {
  const { column, data, sizeperpage } = props;
  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];
  const pagination = paginationFactory({
    page: 1,
    paginationSize: 1,
    sizePerPage: sizeperpage,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: "Next",
    prePageText: "Previous",
    showTotal: true,
    paginationShowsTotal: true,
    withFirstAndLast: false,
    alwaysShowAllBtns: true,
    disablePageTitle: true,
    hideSizePerPage: true,
    onPageChange: function(page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
    onSizePerPageChange: function(page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
  });
  return (
    <div className="site-pagination-table">
      <BootstrapTable
        bootstrap4
        keyField="id"
        striped
        data={data}
        columns={column}
        defaultSorted={defaultSorted}
        pagination={pagination}
      />
    </div>
  );
}

export default Regionview;
