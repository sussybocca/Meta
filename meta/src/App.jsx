import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Editor from "./pages/Editor.jsx";
import Projects from "./pages/Projects.jsx";
import Profile from "./pages/Profile.jsx";
import Preview from "./pages/Preview.jsx";

export default function App() {
  const [currentProject, setCurrentProject] = useState(null);

  // Function to load a project into Editor
  const loadProjectIntoEditor = (name) => {
    setCurrentProject(name); // Pass project name to Editor via props
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Editor projectName={currentProject} />} />
        <Route path="/projects" element={<Projects loadProjectIntoEditor={loadProjectIntoEditor} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </Router>
  );
}
