import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { storageService } from "../services/storageService";
import { ProjectService } from "../services/ProjectService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import { useRef } from "react";
import { getAllUsers } from "../services/authService";

export default function ViewProjects() {
  const textareaRef = useRef(null);
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
  const [taskActive, setTaskActive] = useState(false);
  const [activeTaskRow, setActiveTaskRow] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [error, setError] = useState("");
  const [updateCounter, setUpdateCounter] = useState(0);
  const [asignTo, setAsignTo] = useState("None");
  const [users, setUsers] = useState([]);
  const getAllProjectData = async () => {
    try {
      const response = await ProjectService.GetAllProjects();
      setProjectData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    getAllProjectData();
  }, []); // Only runs once on mount

  useEffect(() => {
    console.log("Updated projectData:", projectData);
  }, [projectData, updateCounter]); // Logs only when projectData updates

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
  const getSelectedTask = async (task, id) => {
    try {
      const resp = await getAllUsers();
      console.log(resp.data);
      setUsers(resp.data);
    } catch {}
    console.log(JSON.parse(task));
    console.log(id);
    setTaskActive(true);
    setTaskStatus(JSON.parse(task).status);
    setAsignTo(JSON.parse(task).responsible);
    setActiveTaskRow(id);
    setTaskComment("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (JSON.parse(task).comment) {
      setAllTaskComment(JSON.parse(task).comment);
    }
  };
  const handleUpdateComment = async () => {
    const task = [];
    projectData[activeProjectRow].tasks.map((obj) => {
      task.push(JSON.parse(obj));
    });
    // console.log(taskComment);
    console.log(taskStatus);
    // console.log(projectData[activeProjectRow]);
    // console.log(task);

    if (taskStatus === "completed" && !taskComment) {
      return;
    }
    taskComment.length > 0
      ? task[activeTaskRow].comment.push(taskComment)
      : (task[activeTaskRow].comment = []);
    task[activeTaskRow].status = taskStatus;
    task[activeTaskRow].responsible = asignTo;

    console.log(projectData[activeProjectRow].id);
    try {
      const resp = await ProjectService.UpdateProjectTask(
        projectData[activeProjectRow].id,
        task
      );
      console.log(task);

      const updatedData = await getAllProjectData();
      setProjectData([...updatedData]);
      setUpdateCounter((prev) => prev + 1); // Forces a re-render
      setTaskData(updatedData[activeProjectRow].tasks);
      setAllTaskComment(
        JSON.parse(updatedData[activeProjectRow].tasks[activeTaskRow]).comment
      );
    } catch (e) {
      setError(e);
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
                      activeProjectRow === index
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
        <Col md={6}>
          <Card className="p-4 shadow">
            <h4>All Tasks</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Responsible</th>
                </tr>
              </thead>
              <tbody>
                {taskData &&
                  taskData.map((task, index) => {
                    const tasks = JSON.parse(task);
                    console.log(tasks);

                    return (
                      <tr
                        key={index}
                        onClick={() => getSelectedTask(task, index)}
                        style={
                          activeTaskRow === index
                            ? {
                                backgroundColor: "#ffcccb",
                                color: "#000",
                                fontWeight: "bold",
                              }
                            : {}
                        }>
                        <td>{tasks.task_name}</td>
                        <td>{tasks.description}</td>
                        <td>{tasks.status}</td>
                        <td>{tasks.responsible}</td>
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
            {taskActive ? (
              <>
                <h4>Add Comment</h4>

                {/* Display existing comments or show "No comments" */}
                <div
                  className="mb-3 p-3 border rounded bg-light"
                  style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {allTaskComment.length > 0 ? (
                    allTaskComment.map((comment, index) => (
                      <div
                        key={index}
                        className="p-2 mb-2 bg-white rounded shadow-sm">
                        <p className="mb-0">{comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">No comments yet</p>
                  )}
                </div>

                {/* Comment Input Form */}
                <Form>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      ref={textareaRef}
                      placeholder="Enter comment"
                      onChange={(e) => setTaskComment(e.target.value)}
                      rows={8}
                    />
                  </Form.Group>

                  {error && <p className="text-danger text-sm">{error}</p>}

                  <Button
                    variant="success"
                    className="mt-3"
                    onClick={handleUpdateComment}>
                    Update
                  </Button>

                  {/* Task Status Dropdown */}
                  <DropdownButton title={taskStatus} id="dropdown-status">
                    <Dropdown.Item
                      key="pending"
                      onClick={() => setTaskStatus("pending")}>
                      Pending
                    </Dropdown.Item>
                    <Dropdown.Item
                      key="in_progress"
                      onClick={() => setTaskStatus("in_progress")}>
                      In Progress
                    </Dropdown.Item>
                    <Dropdown.Item
                      key="completed"
                      onClick={() => setTaskStatus("completed")}>
                      Completed
                    </Dropdown.Item>
                  </DropdownButton>
                  <Form.Label>Asign to</Form.Label>
                  <DropdownButton title={asignTo} id="dropdown-status">
                    {users.map((data, key) => (
                      <Dropdown.Item
                        key={key}
                        onClick={() => setAsignTo(data.username)}>
                        {data.username}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Form>
              </>
            ) : (
              <p>Choose a task</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
