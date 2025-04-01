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
    const [templateDescription, setTemplateDescription] = useState("");
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [searchTemplate, setSearchTemplate] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [templateID, setTemplateID] = useState(null)

    const fetchTasks = async () => {
        try {
            const response = await ProjectService.GetAllTasks();
            setTasks(response.data);

        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };


    const fetchTempaltes = async () => {
        try {
            const response = await ProjectService.GetAllTemplates();
            setTemplates(response.data);



        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };




    useEffect(() => {

        fetchTasks();
        fetchTempaltes();
    }, []);

    const handleAddOrUpdateTemplate = async () => {

        if (!templateName || selectedTasks.length === 0) return;

        const newTemplate = {
            name: templateName,
            description: templateDescription,
            tasks: selectedTasks,
            id: templateID

        };

        if (editingIndex !== null) {
            const updatedTemplates = [...templates];
            updatedTemplates[editingIndex] = newTemplate;
            setTemplates(updatedTemplates);
            setEditingIndex(null);
            try {

                const response = await ProjectService.UpdateOrEditTemplate("edit", updatedTemplates)
            } catch (error) {
                console.error("Error updating template:", error);

            }

        } else {
            try {
                const response = await ProjectService.UpdateOrEditTemplate("add", newTemplate)

            } catch (error) {
                console.error("Error adding template:", error);
            }

            setTemplates([...templates, newTemplate]);

        }

        setTemplateName("");
        setTemplateDescription("");
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

    const handleEditTemplate = (index, id) => {
        setSelectedTasks([]);
        const template = templates[index];
        setTemplateName(template.name);
        setTemplateDescription(template.description);
        setSelectedTasks(template.tasks);
        setEditingIndex(index);
        setTemplateID(id)
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

                    <Form.Group>
                        <Form.Label>Template Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={templateDescription}
                            onChange={(e) => setTemplateDescription(e.target.value)}
                            placeholder="Enter template description"
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

                    <Button className="mt-3 w-100" onClick={handleAddOrUpdateTemplate}>
                        {editingIndex !== null ? "Update Template" : "Add Template"}
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
                            <th>Description</th>
                            <th>Tasks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTemplates.map((template, index) => (
                            <tr key={index}>
                                <td>{template.name}</td>
                                <td>{template.description}</td>
                                <td>{template.tasks.map((task) => {
                                    try {
                                        return JSON.parse(task).task_name
                                    } catch {
                                        return task.task_name
                                    }


                                }).join(", ")}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEditTemplate(index, template.id)}>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}
