import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, checkIfActive } from "../../services/authService";
import { storageService } from "../../services/storageService";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (from storage or backend)
    const checkLoginStatus = async () => {
      if (!storageService.getItem("username")) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await checkIfActive(
          storageService.getItem("username")
        );
        console.log(response);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        storageService.clear();
        navigate("/");
      }
    };

    checkLoginStatus();
  });

  const handleLogout = async () => {
    try {
      if (!storageService.getItem("username")) return;
      const response = await logoutUser(storageService.getItem("username"));
      console.log(response);

      storageService.clear();
      setIsLoggedIn(false);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header style={styles.header}>
      <h1>My App</h1>
      <nav>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/view_projects" style={styles.link}>
              View projects
            </Link>
            <Link to="/crudProject" style={styles.link}>
              Create/Edit Project
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  link: {
    margin: "0 10px",
    color: "white",
    textDecoration: "none",
  },
  logoutButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    cursor: "pointer",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default Header;
