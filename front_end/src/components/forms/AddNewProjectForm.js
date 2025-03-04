import { useState, useEffect } from "react";
import { ProjectService } from "../../services/ProjectService";
import { storageService } from "../../services/storageService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function AddNewProjectForm({ onSubmit, AllTasks }) {
  const [ProjectName, setProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [error, setError] = useState("");
  const [taskList, setTaskList] = useState([{ name: "", description: "" }]);

  const templates = ["Template 1", "Template 2", "Template 3"]; // Example template data
  // const tasks = ["Task A", "Task B", "Task C"]; // Example task data
  const tasks = AllTasks; // Example task data
  const handleTaskSelection = (task) => {
    setSelectedTasks((prevTasks) =>
      prevTasks.includes(task)
        ? prevTasks.filter((t) => t !== task)
        : [...prevTasks, task]
    );
  };
  console.log(AllTasks);

  const handleAddTaskField = () => {
    setTaskList([...taskList, { name: "", description: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTaskList = [...taskList];
    newTaskList[index][field] = value;
    setTaskList(newTaskList);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!ProjectName) {
      setError("Project name can't be empty");
      return;
    }
    try {
      // 
      const response = await ProjectService.AddNewProject(
        ProjectName,
        storageService.getItem("username"),
        // selectedTemplate,
        taskList
      );
      console.log(response);
      onSubmit();
    } catch (error) {
      console.log(error.message, "error");
      setError(error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 mb-4 mt-4">
      <h3>New Project</h3>
      <Form.Control
        type="text"
        placeholder="Project name"
        value={ProjectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full mb-3"
      />

      {/* Template Dropdown */}
      <DropdownButton
        id="dropdown-template"
        title={selectedTemplate || "Select Template"}
        className="mb-3">
        {templates.map((template, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => setSelectedTemplate(template)}>
            {template}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {/* Tasks Multi-Select Dropdown (Only if tasks are not empty) */}
      {tasks.length > 0 ? (
        <DropdownButton
          id="dropdown-task"
          title={selectedTasks.length > 0 ? selectedTasks.join(", ") : "Select Tasks"}
          className="mb-3"
        >
          {tasks.map((task, index) => (

            <Dropdown.Item key={index} onClick={() => handleTaskSelection(task.task_name)}>
              {selectedTasks.includes(task.task_name) ? "✔ " : ""}{task.task_name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      ) : (
        <>
          {taskList.map((task, index) => (
            <div key={index} className="mb-3">
              <Form.Group className="mb-2">
                <Form.Label>Task Name</Form.Label>
                <Form.Control
                  type="text"
                  value={task.name}
                  placeholder="Enter task name"
                  onChange={(e) => handleTaskChange(index, "name", e.target.value)}
                  className="w-full"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  type="text"
                  value={task.description}
                  placeholder="Enter task description"
                  onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                  className="w-full"
                />
              </Form.Group>
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddTaskField} className="mt-2">
            + Add Another Task
          </Button>
        </>
      )}

      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" className="w-full mt-4">
        Add Project
      </Button>
    </Form>
  );
}
