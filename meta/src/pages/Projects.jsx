import React, { useState, useEffect } from "react";
import { loadProjects, createProject, deleteProject, followProject } from "../utils/Projects-Saver.js";

export default function Projects({ loadProjectIntoEditor }) {
  const [projects, setProjects] = useState({});
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const handleCreate = () => {
    if (!newName) return;
    try {
      createProject(newName, "You"); // Replace "You" with actual username
      setProjects(loadProjects());
      setNewName("");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = (name) => {
    deleteProject(name);
    setProjects(loadProjects());
  };

  const handleOpen = (name) => {
    loadProjectIntoEditor(name);
  };

  const handleFollow = (name) => {
    followProject(name, "You");
    setProjects(loadProjects());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>
      <input
        type="text"
        placeholder="New project name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
      <ul>
        {Object.keys(projects).map(name => (
          <li key={name}>
            <strong>{name}</strong> (Owner: {projects[name].owner})
            <button onClick={() => handleOpen(name)}>Open</button>
            <button onClick={() => handleDelete(name)}>Delete</button>
            <button onClick={() => handleFollow(name)}>Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
