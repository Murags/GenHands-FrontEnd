const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiService = {
  get: async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("API Service GET Error:", error);
      throw error;
    }
  },
};

export default apiService;
