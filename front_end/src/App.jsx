import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; // Ensure the correct path
import HomePage from "./pages/HomePage";
import Header from "./components/layout/header";
import ViewProjects from "./pages/ViewProjects";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/view_projects" element={<ViewProjects />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
