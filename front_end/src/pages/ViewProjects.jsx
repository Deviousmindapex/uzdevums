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
  const [searchProject, setSearchProject] = useState("");
  const [currentPageProject, setCurrentPageProject] = useState(1);
  const itemsPerPage = 5;
  const [activeProjectRow, setActiveProjectRow] = useState(null);
  const [allTaskComment, setAllTaskComment] = useState([]);
  const [projectStatus, setProjectStatus] = useState("pending");
  const [taskComment, setTaskComment] = useState("");

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
      console.log(index);
      console.log(projectData);

      setTaskData(projectData[index].tasks);
      setActiveProjectRow(index);
    } catch {
      setTaskData([]);
      setActiveProjectRow(index);
    }
  };
  const getSelectedTask = (task, id) => {
    console.log(task);
    console.log(id);
    if (task.comment) {
      setAllTaskComment(task.comment);
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
                {currentProjects.map((project, index) => (
                  <tr
                    key={project.id}
                    style={
                      activeProjectRow === project.id
                        ? {
                            backgroundColor: "#ffcccb",
                            color: "#000",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                    onClick={() => GetTaskData(index)}>
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
                  taskData.map((task, index) => {
                    const tasks = JSON.parse(task);
                    return (
                      <tr
                        key={index}
                        onClick={() => getSelectedTask(task, index)}>
                        <td>{tasks.name}</td>
                        <td>{tasks.description}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* Column for Editing Task */}
        <Col md={4}>
          <Card className="p-4 shadow">
            <h4>Add comment</h4>
            {allTaskComment.length > 0 ? (
              <p>{allTaskComment}</p>
            ) : (
              <Form>
                <Form.Group>
                  <Form.Control
                    placeholder="Enter comment"
                    onChange={(e) =>
                      setTaskComment(e.target.value)
                    }></Form.Control>
                </Form.Group>
                <Button variant="success" className="mt-3">
                  Add comment
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
