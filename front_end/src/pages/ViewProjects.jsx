import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { storageService } from "../services/storageService";
import { ProjectService } from "../services/ProjectService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

export default function ViewProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchProject, setSearchProject] = useState("");
  const [currentPageProject, setCurrentPageProject] = useState(1);
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

  const filteredProjects = projectData.filter((project) =>
    project.name.toLowerCase().includes(searchProject.toLowerCase())
  );

  const indexOfLastProject = currentPageProject * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPagesProject = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChangeProject = (pageNumber) => {
    setCurrentPageProject(pageNumber);
  };
  const GetTaskData = (index) => {
    try {
      console.log(projectData[index].tasks);

      setTaskData(projectData[index].tasks);
    } catch {
      setTaskData([]);
    }
  };
  return (
    <div className="container mt-4">
      <Row>
        {/* Column for All Projects */}
        <Col md={4}>
          <Card className="p-4 shadow">
            <h4>All Projects</h4>
            <Form.Control
              type="text"
              placeholder="Search projects..."
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
              className="mb-3"
            />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr key={project.id} onClick={() => GetTaskData(project.id)}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="mt-3 justify-content-center">
              {[...Array(totalPagesProject)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPageProject}
                  onClick={() => handlePageChangeProject(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Card>
        </Col>

        {/* Column for All Tasks */}
        <Col md={4}>
          <Card className="p-4 shadow">
            <h4>All Tasks</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {taskData &&
                  taskData.map((task, index) => (
                    <tr key={task.name + index}>
                      <td>{task}</td>
                      <td>{task.description}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* Column for Editing Task */}
        <Col md={4}>
          <Card className="p-4 shadow">
            <h4>Edit Task</h4>
            {selectedTask ? (
              <Form>
                <Form.Group>
                  <Form.Label>Task Text</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedTask.text}
                    onChange={(e) =>
                      setSelectedTask({ ...selectedTask, text: e.target.value })
                    }
                  />
                </Form.Group>
                <Button variant="success" className="mt-3">
                  Save Changes
                </Button>
              </Form>
            ) : (
              <p>Select a task to edit</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
