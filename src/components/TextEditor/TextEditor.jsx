import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TextEditor.css";
import EditorToolbar, { formats, modules } from "./EditorToolbar";

export const TextEditor = (value, onChange) => {
  return (
    <div className="text-editor">
      <EditorToolbar toolbarId={"t1"} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(e) => {
          // console.log("sdafasd", e);
          onChange(e);
        }}
        placeholder={"Write something awesome..."}
        modules={modules("t1")}
        formats={formats}
      />{" "}
    </div>
  );
};
