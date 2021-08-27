import axios from "axios";
import {BASE_ENDPOINT} from "../config";

// console.log(BASE_ENDPOINT)
const baseEndPoint = process.env.REACT_APP_API_BASE_ENDPOINT
console.log(baseEndPoint);

export const handleDataRequest = async (resourceUrl) => {
    try {
        const response = await axios({
            method: "GET",
            url:`${BASE_ENDPOINT}${resourceUrl}`,
            headers : {
                "content-type":"application/json",
            },
        });
        return Promise.resolve(response.data);
    } catch (err){
        return Promise.reject(err)
    }
};

