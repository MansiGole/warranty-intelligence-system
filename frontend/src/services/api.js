import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if backend port/URL changes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (e.g. 401 logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login'; // Optional: auto-redirect
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH API ================= */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

/* ================= PRODUCT API ================= */
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const createProductFromScan = async (scanData) => {
  // scanData should be { product_name, brand, purchase_date }
  const response = await api.post('/products/from-scan', scanData);
  return response.data;
}

/* ================= WARRANTY API ================= */
export const getWarranties = async () => {
  const response = await api.get('/warranties');
  return response.data;
};

export const addWarranty = async (warrantyData) => {
  const response = await api.post('/warranties', warrantyData);
  return response.data;
}


/* ================= RECEIPT SCAN API ================= */
export const scanReceipt = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/scan-receipt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* ================= DOCUMENT UPLOAD API (Backend Saves to Supabase) ================= */
export const uploadDocument = async (productId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('product_id', productId);

  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
}


export default api;
