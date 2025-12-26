import axios from "axios";

const studentAxios = axios.create({
  baseURL: "https://api.smartbus360.com",
  headers: {
    "Content-Type": "application/json",
  },
});
studentAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/student/login";
    }
    return Promise.reject(error);
  }
);


export default studentAxios;
