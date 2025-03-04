import axios from 'axios';
const API_URL = 'http://localhost:3001/api'; // Update this URL if needed


export const ProjectService = {
    async GetAllProjects() {
        try {
            const response = await axios.get(`${API_URL}/GetAllProjects`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    async AddNewProject(name, email, tasks) {
        try {
            const response = await axios.post(`${API_URL}/AddNewProject`, { name, email, tasks });
            console.log(response);
            return response

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add');
        }
    },
    async GetAllTasks() {
        try {
            const response = await axios.get(`${API_URL}/GetAllTasks`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }

    },
    async UpdateProjectTask(id, task) {
        try {
            const response = await axios.post(`${API_URL}/UpdateProjectTask`, { id, task });
            return response
        } catch (error) {
            console.error(error);
            return error;

        }
    }
}
