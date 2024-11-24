import axios from "axios";

const baseURLs = {
  local: "http://localhost:8080/api",
  heroku: "https://kioa-2024-server-ccf6ffa05423.herokuapp.com/api"
};

export default axios.create({
  baseURL: baseURLs.heroku, // Set the default base URL to the local URL
  headers: {
    "Content-type": "application/json"
  }
});