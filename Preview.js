import React from "https://cdn.skypack.dev/react";

export default function Preview({ url }) {
  return (
    <iframe
      src={url}
      style={{ flex: 1, borderTop: "1px solid gray" }}
      title="Live Preview"
    />
  );
}