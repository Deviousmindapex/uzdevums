import axios from 'axios';
const API_URL = 'http://localhost:3001/api'; // Update this URL if needed

export async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email, password
        })
        return response;

    } catch (error) {
        console.log(error, "data2");

        throw new Error(error.response?.data?.message || 'Login failed');

    }
}

export async function logoutUser(email) {
    try {
        const response = await axios.post(`${API_URL}/logout`, { email });
        return response;

    } catch (error) {
        console.log("LogOut error", error);
        throw new Error(error.response?.data?.message || 'LogOut failed');
    }
}
export async function checkIfActive(email) {
    try {

        const response = await axios.get(`${API_URL}/checkIfActive`, { params: { email } });
        return response;
    } catch (error) {
        console.log("checkIfActive error", error);
        throw new Error(error.response?.data?.message || 'checkIfActive failed');
    }
}