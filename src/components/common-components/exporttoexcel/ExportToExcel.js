import React from "react";
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
function ExportToExcel(props) {
  const { exportReportTitle, exportData, exportFileName } = props;
  let column = [];
  let data = [];
  for (let i = 0; i < exportData.length; i++) {
    let item = exportData[i];
    let dataitem = [];
    for (let key in item) {
      if (i == 0) {
        column.push(key);
      }
      dataitem.push(item[key]);
    }
    data.push(dataitem);
  }

  const multiDataSet = [
    {
      columns: column,
      data: data,
    },
  ];
  return (
    <div>
      <ExcelFile
        element={<button>{exportReportTitle}</button>}
        filename={exportFileName}
      >
        <ExcelSheet dataSet={multiDataSet} name="Organization" />
      </ExcelFile>
    </div>
  );
}

export default ExportToExcel;
