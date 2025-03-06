import axios from "axios";

const API_BASE_URL = "http://localhost:9999";

export const getShowtimeByDay = async (movieId, date) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/movie/${movieId}/showtime?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error showtime", error);
    return [];
  }
};
export const addShowtime = async (movieId, showtimeData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${movieId}/showtime`,
      showtimeData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding showtime", error);
    throw error;
  }
};
