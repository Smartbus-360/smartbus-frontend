import axios from "axios";

const studentAxios = axios.create({
  baseURL: "https://api.smartbus360.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default studentAxios;
