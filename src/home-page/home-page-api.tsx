import {authConfig} from "../core";
import axios from "axios";
import {RfsWithDamages} from "../types/RfsWithDamages";

const rfsUrl = `${process.env.REACT_APP_API_URL}/all-rfs`
const predictDamageUrl = `${process.env.REACT_APP_API_URL}/predict-damage`

export type GetAllRfsPayload = {
    data: RfsWithDamages[]
}

export type PredictDamagePayload = {
    data: {
        response: string
    }
}

export const getAllRfs: (authToken: string) => Promise<GetAllRfsPayload> = (authToken) => {
    return axios.get(rfsUrl, authConfig(authToken));
}

export const predictDamage: (authToken: string, rfsId: number) => Promise<PredictDamagePayload> = (authToken, rfsId) => {
    return axios.get(`${predictDamageUrl}/${rfsId}`, authConfig(authToken));
}