import axios from 'axios';
export const API_URL = import.meta.env.VITE_BASE_URL;

//axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});