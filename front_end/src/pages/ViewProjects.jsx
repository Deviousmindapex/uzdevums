import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { storageService } from "../services/storageService";
import { ProjectService } from "../services/ProjectService";
import AddNewProjectForm from "../components/forms/AddNewProjectForm";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

export default function ViewProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [showAddNewProjectForm, setShowAddNewProjectForm] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAllProjectData = async () => {
    try {
      const response = await ProjectService.GetAllProjects();
      console.log(response);
      setProjectData(response.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    getAllProjectData();
  }, []);

  const handleAddNewProject = async () => {
    setShowAddNewProjectForm(false);
    await getAllProjectData();
    console.log("Successfully added project");
  };

  const handleDeleteProject = (id) => {
    setProjectData(projectData.filter((project) => project.id !== id));
    console.log("Deleted project with ID:", id);
  };

  const filteredProjects = projectData.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow">
        <h2 className="mb-4">Project View</h2>
        <div className="d-flex justify-content-between mb-4">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-25"
          />
          <Button
            onClick={() => setShowAddNewProjectForm(!showAddNewProjectForm)}
            variant="primary">
            {showAddNewProjectForm ? "Close Form" : "Add New Project"}
          </Button>
        </div>
        {showAddNewProjectForm && (
          <AddNewProjectForm onSubmit={handleAddNewProject} />
        )}

        {currentProjects.length > 0 ? (
          <>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.status}</td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="mt-3 justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        ) : (
          <p className="text-muted mt-4">No projects available</p>
        )}
      </Card>
    </div>
  );
}
