import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { storageService } from "../services/storageService";
import { ProjectService } from "../services/ProjectService";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import AddNewProjectForm from "../components/forms/AddNewProjectForm"

export default function ProjectList() {

    const [projectData, setProjectData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchProject, setSearchProject] = useState("");
    const [currentPageProject, setCurrentPageProject] = useState(1);
    const [showAddNewProjectForm, setShowAddNewProjectForm] = useState(false);
    const [AllTasks, setAllTasks] = useState([])
    const [allTemplateData, setAllTemplateData] = useState([])



    const itemsPerPage = 5;
    const getAllTasks = async () => {
        const resp = await ProjectService.GetAllTasks()
        console.log(resp, "tasks");
        setAllTasks(resp.data)

    }
    const getAllTemplates = async () => {

        try {
            const resp = await ProjectService.GetAllTemplates()
            setAllTemplateData(resp.data)
            console.log(resp)
        } catch (error) {
            console.log("Couldnt get all templates");
        }
    }
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
        getAllTasks();
        getAllTemplates()
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
    const handleAddNewProject = async () => {
        setShowAddNewProjectForm(false);
        await getAllProjectData();
    }
    return (
        <Card className="p-4 shadow">
            <Row>
                {showAddNewProjectForm && (
                    <AddNewProjectForm onSubmit={handleAddNewProject} AllTasks={AllTasks} AllTemplates={allTemplateData} />
                )}
                <Col>

                    <h4>All Projects</h4>
                </Col>
                <Col>
                    <Button size="sm" variant="success" onClick={() => setShowAddNewProjectForm(!showAddNewProjectForm)}>
                        Create New Project
                    </Button>
                </Col>

            </Row>

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
                        <tr key={project.id}>
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
    )
}