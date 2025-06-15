import httpService from './httpService';

const categoryService = {

  async getAllCategories() {
    const response = await httpService.get('/categories');
    return response.data;
  },

  async getCategoryById(id) {
    const response = await httpService.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await httpService.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await httpService.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await httpService.delete(`/categories/${id}`);
    return response.data;
  },

};

export default categoryService;
