import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
function PaginationData(props) {
  const {
    column,
    data,
    showAddPopup,
    defaultSorted,
    buttonTitle,
    id,
    hidesearch,
  } = props;
  const { SearchBar, ClearSearchButton } = Search;
  const pagination = paginationFactory({
    page: 1,
    paginationSize: 1,
    sizePerPageList: [
      {
        text: "5",
        value: 5,
      },
      {
        text: "10",
        value: 10,
      },
      {
        text: "All",
        value: data.length,
      },
    ],
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: "Next",
    prePageText: "Previous",
    showTotal: true,
    paginationShowsTotal: true,
    withFirstAndLast: false,
    alwaysShowAllBtns: true,
    disablePageTitle: true,
    onPageChange: function(page, sizePerPage) {},
    onSizePerPageChange: function(page, sizePerPage) {},
  });

  //const pagination = paginationFactory();
  return (
    <div>
      <div className="site-pagination-table">
        <ToolkitProvider
          bootstrap4
          keyField={id}
          data={data}
          columns={column}
          search
        >
          {(props) => (
            <>
              <div className="pagination-top-container">
                <div className="searchbox">
                  {!hidesearch && (
                    <>
                      <div className="search-title">Search:</div>
                      <SearchBar {...props.searchProps} />
                      <ClearSearchButton {...props.searchProps} />
                    </>
                  )}
                </div>
                <div className="btn-container">
                  <div className="btn-blue" onClick={() => showAddPopup()}>
                    {buttonTitle}
                  </div>
                </div>
              </div>
              <BootstrapTable
                striped
                defaultSorted={defaultSorted}
                pagination={pagination}
                {...props.baseProps}
              />
            </>
          )}
        </ToolkitProvider>
      </div>
    </div>
  );
}

export default PaginationData;
