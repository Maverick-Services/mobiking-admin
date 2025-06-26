import axios from "axios"

export const getCouriersList = ({ token, data }) => {
    return axios.get(
        'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: data
        }
    )
}
