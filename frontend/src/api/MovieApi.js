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

export const addReview = async (movieId, reviewData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/review/add-new`,
      reviewData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding review", error);
    throw error;
  }
};

export const getNowPlayingMovies = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/movie/main`);
      const allMovies = response.data;

      const today = new Date();

      const nowPlayingMovies = allMovies.filter(movie => {
          const releaseDate = new Date(movie.releaseDate); // Chuyển đổi sang Date object
          return releaseDate <= today; // Chỉ lấy phim đã khởi chiếu
      });

      return nowPlayingMovies;
  } catch (error) {
      console.error("Error fetching now showing movies", error);
      return [];
  }
};

export const getUpcomingMovies = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/movie/main`);
      const allMovies = response.data;

      const today = new Date();

      const nowPlayingMovies = allMovies.filter(movie => {
          const releaseDate = new Date(movie.releaseDate); // Chuyển đổi sang Date object
          return today <= releaseDate; // Chỉ lý phim chua khởi chiếu
      });

      return nowPlayingMovies;
  } catch (error) {
      console.error("Error fetching now showing movies", error);
      return [];
  }
};
