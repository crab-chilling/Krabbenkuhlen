import axios from "axios";

const URL = "http://tp.cpe.fr:8083";
const USER = "/user";

let response = await axios.get(URL + USER + "/" + 1);
console.log("A: " + response);
