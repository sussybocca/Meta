import React from "https://cdn.skypack.dev/react";
import MonacoEditor from "https://cdn.skypack.dev/@monaco-editor/react";

export default function Editor({ fileName, content, updateFile }) {
  return (
    <div style={{ flex: 1 }}>
      <MonacoEditor
        height="50vh"
        language={fileName.endsWith(".js") ? "javascript" : "plaintext"}
        value={content}
        onChange={value => updateFile(fileName, value)}
        theme="vs-dark"
      />
    </div>
  );
}