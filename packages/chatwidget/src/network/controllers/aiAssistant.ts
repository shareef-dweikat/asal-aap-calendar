import AIAnswer from '../models/AIAnswer'
import { TEXT_COMPLETION_ENDPOINT } from '../endpoints'
import axios from 'axios';

export const sendMessage = async (userMessage: string, appInfo: {APP_ID: string, APP_KEY: string}) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "APP_KEY": appInfo.APP_KEY,
            "APP_ID": appInfo.APP_ID
        }
    };

    const data = { }

    let response = await axios.post(`${TEXT_COMPLETION_ENDPOINT}${userMessage}`, data, config)
    return new AIAnswer(response.data.created, response.data.choices)
}