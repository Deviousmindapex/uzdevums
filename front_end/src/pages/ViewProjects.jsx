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

export default function ViewProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigator = useNavigate();
  const [ProjectData, setProjectData] = useState(null);
  useEffect(() => {
    const GetAllProjectData = async () => {
      try {
        const response = await ProjectService.GetAllProjects();
        console.log(response);
        setProjectData({ name: "valdis" });
      } catch (error) {
        console.log(error);
      }
    };
    GetAllProjectData();
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <h1>Project View</h1>
      {ProjectData && <p>{ProjectData.name}</p>}
    </div>
  );
}
