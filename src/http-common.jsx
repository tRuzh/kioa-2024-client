import axios from "axios";

export default axios.create({
  baseURL: "https://kioa-2024-server-ccf6ffa05423.herokuapp.com/api",
  headers: {
    "Content-type": "application/json"
  }
});