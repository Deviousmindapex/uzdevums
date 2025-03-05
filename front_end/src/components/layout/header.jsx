import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, checkIfActive } from "../../services/authService";
import { storageService } from "../../services/storageService";
import { Navbar, Nav, Dropdown, Button } from "react-bootstrap";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!storageService.getItem("username")) {
        setIsLoggedIn(false);
        return;
      }
      try {
        const response = await checkIfActive(
          storageService.getItem("username")
        );
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        storageService.clear();
        navigate("/");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      if (!storageService.getItem("username")) return;
      await logoutUser(storageService.getItem("username"));

      storageService.clear();
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar expand="lg" style={styles.header}>
      <Navbar.Brand style={styles.brand}>My App</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/" style={styles.link}>
          Home
        </Nav.Link>
        {isLoggedIn ? (
          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Projects
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/view_projects">
                View Projects
              </Dropdown.Item>

              {/* Nested Dropdown for Project Tools - Opens Left */}
              <Dropdown drop="start">
                <Dropdown.Toggle
                  variant="secondary"
                  id="nested-dropdown"
                  className="w-100 text-start">
                  Project Tools
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/crudProject">
                    Create/Edit Project
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/createProjectTemplates">
                    Create Project Templates
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} style={{ color: "red" }}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav.Link as={Link} to="/login" style={styles.link}>
            Login
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

const styles = {
  header: {
    backgroundColor: "#333",
    padding: "10px 20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
  },
  brand: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  link: {
    color: "white",
    margin: "0 10px",
    textDecoration: "none",
  },
};

export default Header;
