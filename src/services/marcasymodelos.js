const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${VITE_API_URL || 'http://localhost:3000/api/v1'}/brands-models`;

// Debug helper
const logApiCall = (method, url, data = null) => {
    console.log(`🔗 API Call: ${method} ${url}`, data ? JSON.stringify(data) : '');
};

const logApiResponse = (response, data) => {
    console.log(`📥 API Response: ${response.status} ${response.statusText}`, data);
};

// Brands CRUD operations
export const brandsService = {
  // Get all brands
  getAll: async () => {
    try {
      const url = `${API_BASE_URL}/brands`;
      logApiCall('GET', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching brands: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      logApiResponse(response, result);
      
      if (!result.success) {
        console.error('❌ API returned success=false:', result);
        throw new Error(result.message || 'API returned success=false');
      }
      
      console.log('✅ Brands loaded:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error in brandsService.getAll:', error);
      throw error;
    }
  },

  // Get brand by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`);
      if (!response.ok) throw new Error('Error fetching brand');
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching brand:', error);
      throw error;
    }
  },

  // Create new brand
  create: async (brandData) => {
    try {
      const url = `${API_BASE_URL}/brands`;
      logApiCall('POST', url, brandData);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Error creating brand: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      logApiResponse(response, result);
      
      if (!result.success) {
        console.error('❌ API returned success=false:', result);
        throw new Error(result.message || 'Error creating brand');
      }
      
      console.log('✅ Brand created:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error in brandsService.create:', error);
      throw error;
    }
  },

  // Update brand
  update: async (id, brandData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData),
      });
      if (!response.ok) throw new Error('Error updating brand');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error updating brand');
      return result.data;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  // Delete brand
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting brand');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error deleting brand');
      return result;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  },
};

// Models CRUD operations
export const modelsService = {
  // Get all models
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/models/brand/all`);
      if (!response.ok) throw new Error('Error fetching models');
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching models:', error);
      // If the endpoint doesn't exist, we'll get models from brands endpoint
      return [];
    }
  },

  // Get models by brand ID
  getByBrandId: async (brandId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/models/brand/${brandId}`);
      if (!response.ok) throw new Error('Error fetching models by brand');
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching models by brand:', error);
      throw error;
    }
  },

  // Get model by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/models/${id}`);
      if (!response.ok) throw new Error('Error fetching model');
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching model:', error);
      throw error;
    }
  },

  // Create new model
  create: async (modelData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });
      if (!response.ok) throw new Error('Error creating model');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error creating model');
      return result.data;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  },

  // Update model
  update: async (id, modelData) => {
    try { 
      const url = `${API_BASE_URL}/models/${id}`;
      logApiCall('PUT', url, modelData);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error updating model: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      logApiResponse(response, result);
      
      if (!result.success) {
        console.error('❌ API returned success=false:', result);
        throw new Error(result.message || 'Error updating model');
      }
      
      console.log('✅ Model updated:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error in modelsService.update:', error);
      throw error;
    }
  },

  // Delete model
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/models/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting model');
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error deleting model');
      return result;
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  },
};

// Combined operations
export const brandsModelsService = {
  // Get brands with their models
  getBrandsWithModels: async () => {
    try {
      const url = `${API_BASE_URL}/brands`;
      logApiCall('GET', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching brands with models: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      logApiResponse(response, result);
      
      if (!result.success) {
        console.error('❌ API returned success=false:', result);
        throw new Error(result.message || 'API returned success=false');
      }
      
      console.log('✅ Brands with models loaded:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error in brandsModelsService.getBrandsWithModels:', error);
      throw error;
    }
  },

  // Get vehicles in objVehicles.json format (for SearchBar compatibility)
  getVehicles: async () => {
    try {
      const url = `${API_BASE_URL}/vehicles`;
      logApiCall('GET', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching vehicles: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      logApiResponse(response, result);
      
      if (!result.success) {
        console.error('❌ API returned success=false:', result);
        throw new Error(result.message || 'API returned success=false');
      }
      
      console.log('✅ Vehicles loaded:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error in brandsModelsService.getVehicles:', error);
      throw error;
    }
  },

  // Check if brand has associated models
  brandHasModels: async (brandId) => {
    try {
      const models = await modelsService.getByBrandId(brandId);
      return models.length > 0;
    } catch (error) {
      console.error('Error checking brand models:', error);
      throw error;
    }
  },
};