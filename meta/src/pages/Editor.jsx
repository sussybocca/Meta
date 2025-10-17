import React, { useEffect, useState, useRef } from "react";
import * as monaco from "monaco-editor";
import { WebContainer } from "@webcontainer/api";
import { loadProjects, updateProjectFiles } from "../utils/Projects-Saver.js";

export default function Editor({ projectName }) {
  const [wc, setWc] = useState(null);
  const [currentFile, setCurrentFile] = useState("App.jsx");
  const [files, setFiles] = useState({
    "index.html": "<div id='root'></div>",
    "App.jsx": "export default function App() { return <h1>Hello Meta IDE!</h1> }",
    "main.jsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nReactDOM.createRoot(document.getElementById('root')).render(<App />);"
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Load project files when projectName changes
  useEffect(() => {
    if (projectName) {
      const allProjects = loadProjects();
      if (allProjects[projectName]) {
        const projectFiles = allProjects[projectName].files;
        setFiles(projectFiles);
        setCurrentFile(Object.keys(projectFiles)[0] || "");
      }
    }
  }, [projectName]);

  // Save project files automatically whenever they change
  useEffect(() => {
    if (projectName) {
      updateProjectFiles(projectName, files);
    }
  }, [files, projectName]);

  // Initialize Monaco editor
  useEffect(() => {
    if (!monacoRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: files[currentFile],
        language: currentFile.endsWith(".html") ? "html" : "javascript",
        theme: "vs-dark",
        automaticLayout: true,
      });

      monacoRef.current.onDidChangeModelContent(async () => {
        const newVal = monacoRef.current.getValue();
        setFiles(prev => ({ ...prev, [currentFile]: newVal }));

        if (wc) {
          await wc.fs.writeFile("/" + currentFile, newVal);
        }
      });
    }
  }, [editorRef, wc]);

  // Switch file in editor
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.setValue(files[currentFile]);
      monaco.editor.setModelLanguage(
        monacoRef.current.getModel(),
        currentFile.endsWith(".html") ? "html" : "javascript"
      );
    }
  }, [currentFile, files]);

  // Start WebContainer and run Vite dev server
  const startWebContainer = async () => {
    const webcontainer = await WebContainer.boot();
    setWc(webcontainer);

    // Write project files
    for (const [name, content] of Object.entries(files)) {
      await webcontainer.fs.writeFile("/" + name, content);
    }

    // Initialize npm project
    const init = await webcontainer.spawn("npm", ["init", "-y"]);
    await init.exit;

    // Install React + Vite
    const install = await webcontainer.spawn("npm", ["install", "react", "react-dom", "vite"]);
    install.output.pipeTo(new WritableStream({
      write(data) { console.log(data); }
    }));
    await install.exit;

    // Write minimal vite.config.js
    await webcontainer.fs.writeFile("/vite.config.js",
      `import { defineConfig } from 'vite';
       import react from '@vitejs/plugin-react';
       export default defineConfig({ plugins: [react()] });`
    );

    // Start Vite dev server
    const dev = await webcontainer.spawn("npx", ["vite", "--port", "3000"]);
    dev.output.pipeTo(new WritableStream({ write(data) { console.log(data); } }));

    // Get live URL
    const url = await webcontainer.url;
    setPreviewUrl(url + "/");
  };

  // File management functions
  const addFile = () => {
    const name = prompt("New file name:");
    if (!name) return;
    setFiles(prev => ({ ...prev, [name]: "" }));
    setCurrentFile(name);
    if (wc) wc.fs.writeFile("/" + name, "");
  };

  const deleteFile = (name) => {
    const { [name]: _, ...rest } = files;
    setFiles(rest);
    if (currentFile === name) setCurrentFile(Object.keys(rest)[0] || "");
    if (wc) wc.fs.rm("/" + name);
  };

  const renameFile = (oldName) => {
    const newName = prompt("New name for " + oldName);
    if (!newName) return;
    setFiles(prev => {
      const { [oldName]: content, ...rest } = prev;
      return { ...rest, [newName]: content };
    });
    if (currentFile === oldName) setCurrentFile(newName);
    if (wc) wc.fs.rename("/" + oldName, "/" + newName);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px", borderRight: "1px solid gray", padding: "10px" }}>
        <h3>Files</h3>
        <button onClick={addFile}>New File</button>
        <ul>
          {Object.keys(files).map(name => (
            <li key={name} style={{ marginBottom: "5px" }}>
              <span
                style={{ cursor: "pointer", fontWeight: currentFile === name ? "bold" : "normal" }}
                onClick={() => setCurrentFile(name)}
              >{name}</span>
              <button onClick={() => renameFile(name)}>Rename</button>
              <button onClick={() => deleteFile(name)}>Delete</button>
            </li>
          ))}
        </ul>
        <button onClick={startWebContainer} style={{ marginTop: "10px", padding: "8px" }}>
          Start WebContainer
        </button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div ref={editorRef} style={{ flex: 1, borderBottom: "1px solid gray" }}></div>
        {previewUrl && (
          <iframe
            src={previewUrl}
            style={{ flex: 1, width: "100%", border: "none" }}
            title="Live Preview"
          />
        )}
      </div>
    </div>
  );
}
