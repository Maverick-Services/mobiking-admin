import axios from 'axios'
import useShiprocketAuth from '@/store/useShiprocketAuth' // adjust path as needed

const loginDetails = {
    email: "abhay.gupta.maverick@gmail.com",
    password: "Ou&3fTlpB*%&wrz9",
}

export const shiprocketLogin = async () => {
    try {
        const response = await axios.post(
            'https://apiv2.shiprocket.in/v1/external/auth/login',
            loginDetails
        )

        const data = response?.data || {}

        const { setToken, setLoginResponse } = useShiprocketAuth.getState()
        setToken(data.token)
        setLoginResponse(data)

        return data
    } catch (error) {
        console.error('Shiprocket login failed:', error)
        return null
    }
}
