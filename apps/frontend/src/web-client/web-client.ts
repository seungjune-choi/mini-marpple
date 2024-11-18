import axios, { AxiosError } from 'axios';

const baseClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

baseClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export { baseClient };
