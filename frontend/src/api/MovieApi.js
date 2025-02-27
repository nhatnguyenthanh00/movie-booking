import axios from "axios";

const API_BASE_URL = "http://localhost:9999";

export const get5NewMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movie/main`);
    return response.data
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};
export const getMovieDetail = async (movieId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movie/detail/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie detail", error);
    return null;
  }
};
