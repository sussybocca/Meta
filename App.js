import React, { useState } from "https://cdn.skypack.dev/react";
import Editor from "./Editor.js";
import FileList from "./FileList.js";
import Preview from "./Preview.js";
import { bootWebContainer } from "./WebContainerSetup.js";

export default function App() {
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [webcontainer, setWebcontainer] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Boot WebContainer when user clicks start
  const startContainer = async () => {
    const wc = await bootWebContainer();
    setWebcontainer(wc);
    setPreviewUrl(await wc.url + "/");
  };

  const updateFile = (name, content) => {
    setFiles(prev => ({ ...prev, [name]: content }));
    if (webcontainer) {
      webcontainer.fs.writeFile("/" + name, content);
    }
  };

  const createFile = (name) => {
    setFiles(prev => ({ ...prev, [name]: "" }));
    setCurrentFile(name);
    if (webcontainer) {
      webcontainer.fs.writeFile("/" + name, "");
    }
  };

  const renameFile = (oldName, newName) => {
    const newFiles = { ...files };
    newFiles[newName] = newFiles[oldName];
    delete newFiles[oldName];
    setFiles(newFiles);
    setCurrentFile(newName);
    if (webcontainer) webcontainer.fs.rename("/" + oldName, "/" + newName);
  };

  const deleteFile = (name) => {
    const newFiles = { ...files };
    delete newFiles[name];
    setFiles(newFiles);
    setCurrentFile(Object.keys(newFiles)[0] || null);
    if (webcontainer) webcontainer.fs.rm("/" + name);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "200px", borderRight: "1px solid gray" }}>
        <button onClick={startContainer}>Start WebContainer</button>
        <FileList
          files={files}
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          createFile={createFile}
          renameFile={renameFile}
          deleteFile={deleteFile}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {currentFile && <Editor fileName={currentFile} content={files[currentFile]} updateFile={updateFile} />}
        {previewUrl && <Preview url={previewUrl} />}
      </div>
    </div>
  );
}