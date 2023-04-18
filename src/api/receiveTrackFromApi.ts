import axios from "axios"
import { apiResponse } from "./apiResponse"
require("dotenv").config();

export const receiveTrackFromApi= async (track: string) => {
    const domain_name = process.env.TRACK24_DOMAIN_NAME
    const api_key = process.env.TRACK24_API_KEY
    const response: apiResponse = (await axios.get(`https://api.track24.ru/tracking.json.php?apiKey=${api_key}&domain=${domain_name}&pretty=true&code=${track}&lng=ru`)).data
    
    if (response.message) throw new Error(response.message)

    return response
}