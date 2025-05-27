import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css";
import EditorToolbar, { formats, modules } from "./EditorToolbar";

export const TextEditor = ({ value, onChange, className = "" }) => {
  return (
    <div className="text-editor w-full">
      <EditorToolbar toolbarId={"t1"} />
      <ReactQuill
        className={className}
        theme="snow"
        value={value}
        onChange={(value) => {
          if (value == "<p><br></p>") {
            onChange("");
            return;
          }
          onChange(value);
        }}
        placeholder={"Write something awesome..."}
        modules={modules("t1")}
        formats={formats}
      />

      {/* <div className="ql-editor" dangerouslySetInnerHTML={{ __html: value }} /> */}
    </div>
  );
};
