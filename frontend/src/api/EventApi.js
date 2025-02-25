import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

export const get8NewEvents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/event/`);
        return response.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 8);
    } catch (error) {
        console.error("Error fetching events", error);
        return [];
    }
};