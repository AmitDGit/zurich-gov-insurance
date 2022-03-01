import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import RichTextEditor from "react-rte";
import parse from "html-react-parser";
import "./Style.css";
function FrmRichTextEditor(props) {
  const {
    title,
    name,
    value,
    type,
    isReadMode,
    handleChange,
    isRequired,
    validationmsg,
    issubmitted,
    isdisabled,
  } = props;

  /*ClassicEditor.defaultConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "insertTable",
        "|",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    language: "en",
  };

  const setRichTextValue = (e, editor) => {
    handleChange(name, editor.getData());
  };*/
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],

    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };
  const [editorValue, seteditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  useEffect(() => {
    if (value) {
      seteditorValue(editorValue.setContentFromString(value, "html"));
    }
  }, []);

  const setRichTextValue = (val) => {
    seteditorValue(val);
    handleChange(name, val.toString("html"));
  };
  return (
    <div className={`frm-field ${isRequired ? "mandatory" : ""}`}>
      <label htmlFor={name}>
        <div className="label">{title}</div>
      </label>
      {isReadMode ? (
        <div>{value ? parse(value) : ""}</div>
      ) : (
        <>
          <RichTextEditor
            toolbarConfig={toolbarConfig}
            value={editorValue}
            onChange={setRichTextValue}
            disabled={isdisabled ? isdisabled : false}
          />
          {isRequired &&
          issubmitted &&
          (!value || (value && !value.replace(/<\/?[^>]+(>|$)/g, ""))) ? (
            <div className="validationError">{validationmsg}</div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(FrmRichTextEditor);
