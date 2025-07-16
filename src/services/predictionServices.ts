import axios from "axios";
import { TGroupedProductSales } from "../types/db/product-sales";
import { config } from "dotenv";
import { TPythonAutoPredictionRequest, TPythonAutoPredictionResponse, TPythonManualPredictionRequest, TPythonManualPredictionResponse } from "../types/request/python-api";
import { IPurchaseTable } from "../types/db-model";
import { selectBackendURL } from "../repository/envRepository";
config()

type DummyPredictionOptions = {
    steps: number;
    minValue?: number;
    maxValue?: number;
    mapeRange?: [number, number];
    rmseRange?: [number, number];
};

export function generateDummyPrediction(options: DummyPredictionOptions): TPythonAutoPredictionResponse {
    const {
        steps,
        minValue = 100,
        maxValue = 500,
        mapeRange = [1, 20],
        rmseRange = [10, 60],
    } = options;

    const prediction = Array.from({ length: steps }, () =>
        parseFloat((Math.random() * (maxValue - minValue) + minValue).toFixed(2))
    );

    const lower = prediction.map(p => parseFloat((p * 0.9).toFixed(2)));
    const upper = prediction.map(p => parseFloat((p * 1.1).toFixed(2)));

    const mape = parseFloat((Math.random() * (mapeRange[1] - mapeRange[0]) + mapeRange[0]).toFixed(2));
    const rmse = parseFloat((Math.random() * (rmseRange[1] - rmseRange[0]) + rmseRange[0]).toFixed(2));

    const arima_order: [number, number, number] = [
        Math.floor(Math.random() * 2) + 1, // p: 1-2
        Math.floor(Math.random() * 2),     // d: 0-1
        Math.floor(Math.random() * 2) + 1  // q: 1-2
    ];

    return {
        success: true,
        arima_order,
        prediction,
        lower,
        upper,
        mape,
        rmse
    };
}

export async function makeAutoPrediction(data: TPythonAutoPredictionRequest): Promise<TPythonAutoPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Bisa tambahkan logika pakai isi `data` di sini
        return generateDummyPrediction({ steps });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto (dummy):', error?.message || error);
        return null;
    }
}

export async function makeManualPrediction(data: TPythonManualPredictionRequest): Promise<TPythonManualPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Bisa tambahkan logika pakai isi `data` di sini
        return generateDummyPrediction({ steps });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateAutoPrediction(data: TPythonAutoPredictionRequest): Promise<TPythonAutoPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Bisa tambahkan logika pakai isi `data` di sini
        return generateDummyPrediction({ steps });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateManualPrediction(data: TPythonManualPredictionRequest): Promise<TPythonManualPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Bisa tambahkan logika pakai isi `data` di sini
        return generateDummyPrediction({ steps });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}