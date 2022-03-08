import React, { useState, useEffect } from "react";
import "./Style.css";
function FrmFileUpload(props) {
  const {
    title,
    name,
    value,
    uploadedfiles,
    type,
    isReadMode,
    handleFileUpload,
    handleFileDelete,
    isRequired,
    validationmsg,
    issubmitted,
    isshowloading,
    isdisabled,
  } = props;
  const [selectedfile, setselectedfile] = useState();
  const [filename, setfilename] = useState("");
  const [files, setfiles] = useState([]);
  useEffect(() => {
    let tempfiles = [];
    if (uploadedfiles.length) {
      tempfiles = [...uploadedfiles];
      tempfiles = tempfiles.map((item) => {
        let filename = item.filePath.split("\\")[
          item.filePath.split("\\").length - 1
        ];
        let fileurl = item.filePath;
        return {
          id: item.logAttachmentId,
          filename: filename,
          fileurl: fileurl,
        };
      });
    }
    setfiles([...tempfiles]);
  }, [uploadedfiles]);

  const onfileselect = (e) => {
    let _this = e.target;
    let fileName = "";
    setselectedfile(_this.files);
    if (_this.files && _this.files.length > 1) {
      fileName = (_this.getAttribute("data-multiple-caption") || "").replace(
        "{count}",
        _this.files.length
      );
    } else {
      fileName = e.target.value.split("\\").pop();
    }

    if (fileName) {
      setfilename(fileName);
    }
  };
  const onfileuploadhandler = () => {
    handleFileUpload(name, selectedfile);
    setfilename("");
    setselectedfile("");
    document.getElementById("file").value = null;
  };
  const deleteAttachment = (id, fileurl) => {
    handleFileDelete(id, fileurl);
  };
  return (
    <div
      className={`frm-field fileupload ${
        isRequired ? "mandatory" : ""
      } ${isdisabled && "disabled"}`}
    >
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {!isReadMode ? (
        <>
          <div className="select-file-container">
            <input
              type="file"
              name="file"
              id="file"
              class="inputfile"
              multiple
              data-multiple-caption="{count} files selected"
              onChange={onfileselect}
              disabled={isdisabled ? isdisabled : false}
            />
            <label for="file">
              <div className="select-filebox">
                <div className="selected-files">
                  {filename ? filename : "Choose a file…"}
                </div>
                <div
                  className={`btn-blue browse-btn ${isdisabled && "disable"}`}
                >
                  Browse
                </div>
              </div>
            </label>
            <div
              className={`upload-btn btn-blue ${
                filename ? "normal" : "disable"
              }`}
              onClick={onfileuploadhandler}
            >
              Upload
            </div>
            {isshowloading ? <span>Loading...</span> : ""}
          </div>
          {isRequired && issubmitted && !value ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}

      {files.length ? (
        <div className="attached-files-container">
          {files.map((item) => (
            <div key={item.filename} className="file-name-container">
              <div className="file-name">
                <a href={item.fileurl} target="_blank">
                  {item.filename}
                </a>
              </div>
              {!isReadMode && !isdisabled ? (
                <div
                  className="delete-icon"
                  onClick={() => deleteAttachment(item.id, item.fileurl)}
                ></div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(FrmFileUpload);
