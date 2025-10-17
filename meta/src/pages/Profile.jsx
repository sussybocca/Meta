import React, { useState, useEffect } from "react";
import { loadProjects } from "../utils/Projects-Saver.js";

export default function Profile() {
  const username = "You"; // Replace with dynamic login
  const [projects, setProjects] = useState([]);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const allProjects = loadProjects();
    const userProjects = Object.entries(allProjects)
      .filter(([name, proj]) => proj.owner === username)
      .map(([name, proj]) => ({ name, followers: proj.followers.length }));
    setProjects(userProjects);
    const totalFollowers = userProjects.reduce((sum, p) => sum + p.followers, 0);
    setFollowers(totalFollowers);
  }, []);

  const devAccount = followers >= 1000;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile: {username}</h2>
      <p>Followers (Metas): {followers}</p>
      <p>Dev Account: {devAccount ? "Unlocked ✅" : "Locked ⛔"}</p>
      <h3>Your Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p.name}>{p.name} (Followers: {p.followers})</li>
        ))}
      </ul>
    </div>
  );
}
