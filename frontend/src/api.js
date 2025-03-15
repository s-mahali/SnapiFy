import axios from 'axios';
export const API_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

//axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});