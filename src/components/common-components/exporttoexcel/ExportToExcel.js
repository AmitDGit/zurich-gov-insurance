import React from "react";
import ReactExport from "react-data-export";
import "./Style.css";
import { formatDate } from "../../../helpers";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportToExcel(props) {
  const {
    exportReportTitle,
    exportData,
    exportFileName,
    exportExcludeFields,
    exportFieldTitles,
    exportHtmlFields,
    exportDateFields,
  } = props;
  let column = [];
  let data = [];
  for (let i = 0; i < exportData.length; i++) {
    let item = exportData[i];
    let dataitem = [];
    for (let key in item) {
      if (!exportExcludeFields.includes(key)) {
        if (i === 0) {
          if (exportFieldTitles && exportFieldTitles[key]) {
            column.push(exportFieldTitles[key]);
          } else {
            column.push(key);
          }
        }
        if (exportHtmlFields.includes(key) && item[key]) {
          dataitem.push(item[key].replace(/<\/?[^>]+(>|$)/g, ""));
        } else if (exportDateFields[key] && item[key]) {
          dataitem.push(formatDate(item[key]));
        } else {
          dataitem.push(item[key]);
        }
      }
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
        element={<button className="exportxlsbtn">{exportReportTitle}</button>}
        filename={exportFileName}
      >
        <ExcelSheet dataSet={multiDataSet} name="Organization" />
      </ExcelFile>
    </div>
  );
}

export default React.memo(ExportToExcel);
