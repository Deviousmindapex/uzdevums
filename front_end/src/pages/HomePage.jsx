import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { storageService } from "../services/storageService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigator = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <h1>Home Page</h1>
      <button
        onClick={() => {
          storageService.clear();
          setIsAuthenticated(false);
          navigator("/login");
        }}>
        Logout
      </button>
    </div>
  );
}
