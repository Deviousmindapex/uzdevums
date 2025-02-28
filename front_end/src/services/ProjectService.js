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
}
