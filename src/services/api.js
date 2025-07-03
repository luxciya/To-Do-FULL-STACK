import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://to-do-full-stack-production.up.railway.app/api/tasks',
  withCredentials: true,
});
