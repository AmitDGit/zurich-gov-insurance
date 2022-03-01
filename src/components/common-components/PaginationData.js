import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import ExportToExcel from "./exporttoexcel/ExportToExcel";
function PaginationData(props) {
  const {
    column,
    data,
    showAddPopup,
    defaultSorted,
    buttonTitle,
    id,
    hidesearch,
    isExportReport,
    exportReportTitle,
    exportFileName,
    exportExcludeFields,
    exportHtmlFields,
  } = props;
  //console.log(data);
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
        text: "25",
        value: 25,
      },
      /* {
        text: "All",
        value: data.length,
      },*/
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
                  {isExportReport ? (
                    <ExportToExcel
                      exportReportTitle={exportReportTitle}
                      exportFileName={exportFileName}
                      exportData={data}
                      exportExcludeFields={exportExcludeFields}
                      exportHtmlFields={exportHtmlFields}
                    />
                  ) : (
                    ""
                  )}
                  <div
                    className="btn-blue plus-icon"
                    onClick={() => showAddPopup()}
                  >
                    {buttonTitle}
                  </div>
                </div>
              </div>
              <BootstrapTable
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
