import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Form } from "react-bootstrap";
import { storageService } from "../services/storageService";
import { ProjectService } from "../services/ProjectService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { useRef } from "react";
import { getAllUsers } from "../services/authService";

export default function CreateProjectTemplateView() {
    const [templates, setTemplates] = useState([]);
    const [templateName, setTemplateName] = useState("");
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [searchTemplate, setSearchTemplate] = useState("");

    useEffect(() => {
        // Fetch all tasks (assuming ProjectService has a method for this)
        const fetchTasks = async () => {
            try {
                const response = await ProjectService.GetAllTasks();
                setTasks(response.data);

            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const handleAddTemplate = () => {
        if (!templateName || selectedTasks.length === 0) return;

        const newTemplate = {
            name: templateName,
            tasks: selectedTasks,
        };
        setTemplates([...templates, newTemplate]);
        setTemplateName("");
        setSelectedTasks([]);
    };

    const handleTaskSelection = (event) => {
        const options = event.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(tasks[i]);
            }
        }
        setSelectedTasks(selected);
    };

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchTemplate.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h1>Create Project Template</h1>
            <Card className="p-4 shadow">
                <Form>
                    <Form.Group>
                        <Form.Label>Template Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name"
                        />
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Select Tasks</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            onChange={handleTaskSelection}
                            className="w-100"
                        >
                            {tasks.map((task, index) => (
                                <option key={index} value={task.task_name}>
                                    {task.task_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Button className="mt-3 w-100" onClick={handleAddTemplate}>
                        Add Template
                    </Button>
                </Form>
            </Card>

            <Card className="p-4 shadow mt-4">
                <h3>Templates</h3>
                <Form.Control
                    type="text"
                    placeholder="Search templates..."
                    value={searchTemplate}
                    onChange={(e) => setSearchTemplate(e.target.value)}
                    className="mb-3"
                />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tasks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTemplates.map((template, index) => (
                            <tr key={index}>
                                <td>{template.name}</td>
                                <td>{template.tasks.map((task) => task.task_name).join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}
