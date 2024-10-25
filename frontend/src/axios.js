import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // The base URL of your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
