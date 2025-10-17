// Handles saving project files (simulated persistence)
export const saveFiles = (files) => {
  localStorage.setItem("meta-files", JSON.stringify(files));
};

export const loadFiles = () => {
  return JSON.parse(localStorage.getItem("meta-files")) || [];
};
