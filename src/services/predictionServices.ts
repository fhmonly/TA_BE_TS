import axios from "axios";
import { TGroupedProductSales } from "../types/db/product-sales";
import { config } from "dotenv";
import { TPythonAutoPredictionRequest, TPythonAutoPredictionResponse, TPythonManualPredictionRequest, TPythonManualPredictionResponse } from "../types/request/python-api";
import { IPurchaseTable } from "../types/db-model";
import { selectBackendURL } from "../repository/envRepository";
config()

export async function makeAutoPrediction(data: TPythonAutoPredictionRequest) {
    try {
        const baseUrl = await selectBackendURL()
        const response = await axios.post<TPythonAutoPredictionResponse>(`/predict/auto`, data, {
            method: 'post',
            // baseURL: process.env.PYTHON_API_HOST,
            baseURL: baseUrl,
        })

        if (response.status === 200 && response.data.success) {
            return response.data;
        } else {
            console.warn('Prediksi gagal atau response tidak sesuai:', response.data);
            return null;
        }
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto:', error?.response?.data || error.message);
        return null;
    }
}

export async function makeManualPrediction(data: TPythonManualPredictionRequest) {
    try {
        const baseUrl = await selectBackendURL()
        const response = await axios.post<TPythonManualPredictionResponse>(`/predict/manual`, data, {
            method: 'post',
            // baseURL: process.env.PYTHON_API_HOST,
            baseURL: baseUrl,
        })
        if (response.status === 200 && response.data.success) {
            return response.data;
        } else {
            console.warn('Prediksi gagal atau response tidak sesuai:', response.data);
            return null;
        }
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateAutoPrediction(data: TPythonAutoPredictionRequest) {
    try {
        const baseUrl = await selectBackendURL()

        const response = await axios.post<TPythonAutoPredictionResponse>(`/predict/private/auto`, data, {
            method: 'post',
            // baseURL: process.env.PYTHON_API_HOST,
            baseURL: baseUrl,
        })

        if (response.status === 200 && response.data.success) {
            return response.data;
        } else {
            console.warn('Prediksi gagal atau response tidak sesuai:', response.data);
            return null;
        }
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateManualPrediction(data: TPythonManualPredictionRequest) {
    try {
        const baseUrl = await selectBackendURL()

        const response = await axios.post<TPythonManualPredictionResponse>(`/predict/private/manual`, data, {
            method: 'post',
            // baseURL: process.env.PYTHON_API_HOST,
            baseURL: baseUrl,
        })
        if (response.status === 200 && response.data.success) {
            return response.data;
        } else {
            console.warn('Prediksi gagal atau response tidak sesuai:', response.data);
            return null;
        }
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}