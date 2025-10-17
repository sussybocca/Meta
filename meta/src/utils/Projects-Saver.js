// Projects-Saver.js
// Structure: { [projectName]: { files: {}, owner: string, notes: [], followers: [] } }

export const loadProjects = () => {
  return JSON.parse(localStorage.getItem("meta-projects")) || {};
};

export const saveProjects = (projects) => {
  localStorage.setItem("meta-projects", JSON.stringify(projects));
};

// Create a new project
export const createProject = (name, owner) => {
  const projects = loadProjects();
  if (projects[name]) throw new Error("Project already exists");
  projects[name] = { files: {}, owner, notes: [], followers: [] };
  saveProjects(projects);
};

// Delete a project
export const deleteProject = (name) => {
  const projects = loadProjects();
  delete projects[name];
  saveProjects(projects);
};

// Add a note to a project
export const addNoteToProject = (projectName, note) => {
  const projects = loadProjects();
  if (!projects[projectName]) return;
  projects[projectName].notes.push(note);
  saveProjects(projects);
};

// Follow a project
export const followProject = (projectName, user) => {
  const projects = loadProjects();
  if (!projects[projectName]) return;
  if (!projects[projectName].followers.includes(user)) {
    projects[projectName].followers.push(user);
    saveProjects(projects);
  }
};

// **New: Update files for a project**
export const updateProjectFiles = (projectName, newFiles) => {
  const projects = loadProjects();
  if (!projects[projectName]) return;
  projects[projectName].files = newFiles;
  saveProjects(projects);
};
