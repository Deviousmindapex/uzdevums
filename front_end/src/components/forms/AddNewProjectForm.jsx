import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import { ProjectService } from "../../services/ProjectService";
import { storageService } from "../../services/storageService";

export default function AddNewProjectForm({ onSubmit }) {
  const [ProjectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!ProjectName) {
      setError("Project name cant be empty");
      return;
    }
    try {
      const response = await ProjectService.AddNewProject(
        ProjectName,
        storageService.getItem("username")
      );
      console.log(response);

      onSubmit();
    } catch (error) {
      console.log(error.message, "errro");
      setError(error.message);
    }
    // Call the login handler
    // try {
    //   const response = await loginUser(email, password);
    //   console.log("Login successful", response);
    //   onLogin(email, password); // Only proceed if login is successful
    // } catch (error) {
    //   console.error("Login failed:", error.message);
    //   setError(error.message); // Display error message to user
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Project name"
        value={ProjectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
