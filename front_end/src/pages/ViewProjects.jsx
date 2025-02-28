import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { storageService } from "../services/storageService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/ProjectService";
import AddNewProjectForm from "../components/forms/AddNewProjectForm";

export default function ViewProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigator = useNavigate();
  const [ProjectData, setProjectData] = useState(null);
  const [showAddNewProjectFrom, setShowAddNewProjectFrom] = useState(false);
  const GetAllProjectData = async () => {
    try {
      const response = await ProjectService.GetAllProjects();
      console.log(response);
      setProjectData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    GetAllProjectData();
  }, []);
  const handleAddNewProject = async (e) => {
    setShowAddNewProjectFrom(false);
    await GetAllProjectData();
    console.log("succesfully added project");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <h1>Project View</h1>
      <button
        onClick={() => {
          setShowAddNewProjectFrom(!showAddNewProjectFrom);
        }}>
        Add New Project
      </button>
      {showAddNewProjectFrom && (
        <AddNewProjectForm onSubmit={handleAddNewProject} />
      )}
      {Array.isArray(ProjectData) && ProjectData.length > 0 && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          <p className="font-bold">Projects:</p>
          <ul>
            {ProjectData.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong> - Status: {project.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
