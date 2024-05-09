import {authConfig, fileConfig} from "../core";
import axios from "axios";
import {RfsWithDamages} from "../types/RfsWithDamages";

const rfsUrl = `${process.env.REACT_APP_API_URL}/rfs`
const predictDamageUrl = `${process.env.REACT_APP_API_URL}/rfs/predict-damage`
const saveRfs = `${process.env.REACT_APP_API_URL}/rfs`

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

export const addRfs: (authToken: string, testName: string, file: File) => Promise<void> = (authToken, testName, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("testName", testName);
    return axios.post(saveRfs, formData, fileConfig(authToken));
}