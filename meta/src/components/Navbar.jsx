import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link style={{ marginRight: "15px", color: "#fff" }} to="/">Editor</Link>
      <Link style={{ marginRight: "15px", color: "#fff" }} to="/projects">Projects</Link>
      <Link style={{ marginRight: "15px", color: "#fff" }} to="/profile">Profile</Link>
      <Link style={{ marginRight: "15px", color: "#fff" }} to="/preview">Preview</Link>
    </nav>
  );
}
