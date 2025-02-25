import api from "./baseApi";

const eventApi = {
  // Get all events
  getAll: async () => {
    const url = `/event`;
    const response = await api.get(url);
    return response;
  },
  getEventById: async (id) => {
    console.log("day nauy", id);
    const url = `/event/${id}`;
    const response = await api.get(url);
    return response;
  },
};

export default eventApi;
