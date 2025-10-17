import React from "react";

export default function Notes({ notes }) {
  return (
    <div style={{ padding: "10px", borderTop: "1px solid gray" }}>
      <h3>Notes</h3>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
