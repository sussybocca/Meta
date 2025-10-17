import React, { useState } from "https://cdn.skypack.dev/react";

export default function FileList({ files, currentFile, setCurrentFile, createFile, renameFile, deleteFile }) {
  const [newFileName, setNewFileName] = useState("");

  return (
    <div>
      <h3>Files</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.keys(files).map(name => (
          <li key={name}>
            <span
              style={{ cursor: "pointer", fontWeight: currentFile === name ? "bold" : "normal" }}
              onClick={() => setCurrentFile(name)}
            >
              {name}
            </span>
            <button onClick={() => deleteFile(name)}>X</button>
          </li>
        ))}
      </ul>
      <input
        placeholder="New file"
        value={newFileName}
        onChange={e => setNewFileName(e.target.value)}
      />
      <button onClick={() => { createFile(newFileName); setNewFileName(""); }}>Add</button>
    </div>
  );
}