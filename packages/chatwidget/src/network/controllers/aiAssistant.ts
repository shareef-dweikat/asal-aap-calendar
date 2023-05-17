import AIAnswer from '../models/AIAnswer'
import { TEXT_COMPLETION_ENDPOINT } from '../endpoints'
import axios from 'axios';

export const sendMessage = async (userMessage: string) => {
    const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NWEyMGYzZWZjYTc2ODYxYjhlMjYzNCIsImlhdCI6MTY4NDEzMDk4MCwiZXhwIjoxNjg2NzIyOTgwfQ.IIYCNmDputBJMjUkDY4F5OphZFC1ZPrqCjCEEUi_1S4'
    const config = {
        headers: {
            "Authorization": API_KEY,
            "Content-Type": "application/json"
        }
    };

    const data = { }

    let response = await axios.post(`${TEXT_COMPLETION_ENDPOINT}${userMessage}`, data, config)
    return new AIAnswer(response.data.created, response.data.choices)
}