import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = (email, password) => {
    console.log("Logging in with", { email, password });
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
