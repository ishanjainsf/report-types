import dotenv from "dotenv"
dotenv.config();

export const BASE_ENDPOINT = process.env.REACT_APP_API_BASE_ENDPOINT
console.log(process.env.REACT_APP_API_BASE_ENDPOINT)