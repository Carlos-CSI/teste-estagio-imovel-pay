import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080' // Verifique se o seu backend está nessa porta!
});

export default api;