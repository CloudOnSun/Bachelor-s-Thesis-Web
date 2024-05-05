import axios from "axios";
import {config} from "../core";
import {User} from "../types/User";

const authUrl = `${process.env.REACT_APP_API_URL}/authenticate`

export interface AuthProps {
    data: {
        accessToken: string,
        user: User,
    }
}

export const loginApi: (userEmail?: string, password?: string) => Promise<AuthProps> = (userEmail, password) => {
    console.log(authUrl);
    console.log(userEmail + " " + password);
    return axios.post(authUrl, {email: userEmail, password}, config)
}