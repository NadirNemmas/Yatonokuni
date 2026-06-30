import { createContext, useContext, useRef, useState } from "react";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(null);
  const loadingRef = useRef(false);

  const fetchProjects = async () => {
    if (projects !== null || loadingRef.current) return;
    loadingRef.current = true;

    const MIN_LOADING_MS = 1500;
    const start = Date.now();

    try {
      const res = await fetch("/projets");
      const data = await res.json();
      const elapsed = Date.now() - start;
      const remaining = MIN_LOADING_MS - elapsed;
      await new Promise((r) => setTimeout(r, Math.max(0, remaining)));
      setProjects(data);
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <ProjectsContext.Provider value={{ projects, fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}
