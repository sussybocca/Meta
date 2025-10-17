import React from "react";

export default function FileTree({ files, onSelectFile }) {
  const renderFiles = (fileList) => {
    return fileList.map(file => {
      if (file.type === "folder") {
        return (
          <li key={file.name}>
            <strong>{file.name}/</strong>
            <ul>{renderFiles(file.children)}</ul>
          </li>
        );
      } else {
        return (
          <li key={file.name} onClick={() => onSelectFile(file)} style={{ cursor: "pointer" }}>
            {file.name}
          </li>
        );
      }
    });
  };

  return (
    <div style={{ width: "200px", borderRight: "1px solid gray", padding: "10px" }}>
      <h3>Files</h3>
      <ul>{renderFiles(files)}</ul>
    </div>
  );
}
