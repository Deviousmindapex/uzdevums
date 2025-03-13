import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import { loginUser } from "../../services/authService";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    // Call the login handler
    try {
      const response = await loginUser(email, password);
      "Login successful", response;
      onLogin(email, password); // Only proceed if login is successful
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message); // Display error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
