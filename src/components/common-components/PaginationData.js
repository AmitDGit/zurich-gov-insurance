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
    datatotalcount,
    showAddPopup,
    defaultSorted,
    buttonTitle,
    id,
    hidesearch,
    isExportReport,
    exportReportTitle,
    exportFileName,
    exportExcludeFields,
    exportFieldTitles,
    exportHtmlFields,
    exportDateFields,
  } = props;
  const { SearchBar, ClearSearchButton } = Search;

  const sizeperpageoptions = [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
  ];
  const [totalcount, settotalcount] = useState(0);
  const [totalmsg, settotalmsg] = useState("");
  const pagination = paginationFactory({
    page: 1,
    paginationSize: 1,
    sizePerPageList: sizeperpageoptions,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: "Next",
    prePageText: "Previous",
    showTotal: true,
    paginationShowsTotal: true,
    withFirstAndLast: false,
    alwaysShowAllBtns: true,
    disablePageTitle: true,
    onPageChange: function(page, sizePerPage) {
      onpageloadchange(page, sizePerPage);
    },
    onSizePerPageChange: function(sizePerPage, page) {
      onpageloadchange(page, sizePerPage);
    },
  });
  useEffect(() => {
    let totalcount = datatotalcount ? datatotalcount : data.length;
    settotalcount(totalcount);
  }, [data]);
  useEffect(() => {
    onpageloadchange(1, sizeperpageoptions[0].value);
  }, [totalcount]);

  const onpageloadchange = (page, sizePerPage) => {
    let startindex = sizePerPage * (page - 1) + 1;
    let endindex = sizePerPage * page;
    settotalmsg(`Showing ${startindex} to ${endindex} of ${totalcount}`);
  };
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
                      exportFieldTitles={exportFieldTitles}
                      exportHtmlFields={exportHtmlFields}
                      exportDateFields={exportDateFields}
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
              <div className="showtotalmsg">{totalmsg}</div>
            </>
          )}
        </ToolkitProvider>
      </div>
    </div>
  );
}

export default PaginationData;
