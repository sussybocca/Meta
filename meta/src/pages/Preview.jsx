import React from "react";

export default function Preview() {
  return (
    <div style={{ height: "90vh" }}>
      <iframe
        title="Project Preview"
        style={{ width: "100%", height: "100%", border: "none" }}
        srcDoc="<h1>Preview will show here</h1>"
      />
    </div>
  );
}
