// import { deleteToken, setToken } from "@/redux/slice/token.slice";
// import { logoutUser } from "@/redux/slice/user.slice";
// import { store } from "@/redux/store";
import axios from "axios";

const config = {
  BASE_URL: import.meta.env.VITE_SERVER_URL,
  TIME_OUT: 10000,
};

export const httpClient = axios.create({
  withCredentials: true,
  headers: {
    Accept: ["application/json", "multipart/form-data"],
    "Content-Type": "application/json",
  },
  baseURL: config.BASE_URL,
  timeout: config.TIME_OUT,
});

//Config request gửi đi
httpClient.interceptors.request.use(
  async function (request) {
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response //Config response nhận về
  .use(
    function (response) {
      return response && response.data ? response.data : response;
    },
    function (error) {
      if (error && error.response && error.response.data) {
        return Promise.reject(error);
        // return error.response.data;
      }
    }
  );
