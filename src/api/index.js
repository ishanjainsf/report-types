import axios from "axios";

export const handleDataRequest = async (resourceUrl) => {
    try {
        const response = await axios({
            method: "GET",
            url:`${resourceUrl}`,
            headers : {
                "content-type":"application/json",
            },
        });
        return Promise.resolve(response.data);
    } catch (err){
        return Promise.reject(err)
    }
};

