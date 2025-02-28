import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import LoginForm from "../components/auth/LoginForm";
import { storageService } from "../services/storageService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const handleLogin = (email, password) => {
    console.log("Logging in with", { email, password });
    setIsAuthenticated(true);
    storageService.setItem("username", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onLogin={handleLogin} />
        </CardContent>
      </Card>
    </div>
  );
}
