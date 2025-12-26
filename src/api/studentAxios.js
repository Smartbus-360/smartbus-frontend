// import axios from "axios";

// const studentAxios = axios.create({
//   baseURL: "https://api.smartbus360.com",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// studentAxios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = "/student/login";
//     }
//     return Promise.reject(error);
//   }
// );


// export default studentAxios;

import axios from "axios";

const studentAxios = axios.create({
  baseURL: "https://api.smartbus360.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
studentAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Auto logout on 401
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

