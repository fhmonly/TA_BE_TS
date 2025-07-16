import axios from "axios";
import { TGroupedProductSales } from "../types/db/product-sales";
import { config } from "dotenv";
import { TPythonAutoPredictionRequest, TPythonAutoPredictionResponse, TPythonManualPredictionRequest, TPythonManualPredictionResponse } from "../types/request/python-api";
import { IPurchaseTable } from "../types/db-model";
import { selectBackendURL } from "../repository/envRepository";
import papaparse from 'papaparse'

config()

type DummyPredictionOptions = {
    steps: number;
    lastValue: number;
    averageValue: number;
    mapeRange?: [number, number];
    rmseRange?: [number, number];
};

export function generateDummyPrediction(options: DummyPredictionOptions): TPythonAutoPredictionResponse {
    const {
        lastValue,
        averageValue,
    } = options;

    // Pakai nilai prediksi tetap: average
    const prediction = [averageValue];

    // ±10% interval dari prediksi
    const lower = prediction.map(p => parseFloat((p * 0.9).toFixed(2)));
    const upper = prediction.map(p => parseFloat((p * 1.1).toFixed(2)));

    // MAPE: persentase selisih absolut antara last dan average
    const mape = lastValue === 0
        ? 0
        : parseFloat((Math.abs((lastValue - averageValue) / lastValue) * 100).toFixed(2));

    // RMSE: selisih absolut (karena cuma satu titik dibandingkan)
    const rmse = parseFloat(Math.abs(lastValue - averageValue).toFixed(2));

    // Order ARIMA dummy tetap bisa diset random atau tetap
    const arima_order: [number, number, number] = [2, 1, 2];

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

        // Parse CSV dengan papaparse
        const parsedCSV = papaparse.parse<Record<string, any>>(data.csv_string, { header: true });

        // Ambil daftar nilai dan ubah jadi angka, fallback ke 0 kalau gagal
        const amountList = parsedCSV.data
            .map(v => Number(v[data.value_column]))
            .filter(v => !isNaN(v))
            .map(v => Math.max(0, v)); // Pastikan tidak negatif

        // Hitung rata-rata dan nilai terakhir
        const averageAmount = amountList.length > 0
            ? amountList.reduce((sum, val) => sum + val, 0) / amountList.length
            : 0;

        const lastAmount = amountList.length > 0
            ? amountList[amountList.length - 1]
            : 0;

        // Return prediksi dummy (misalnya random di antara avg dan last)
        return generateDummyPrediction({
            // minValue: Math.min(averageAmount, lastAmount),
            lastValue: Math.max(0, lastAmount),
            averageValue: Math.max(0, averageAmount),
            steps,
        });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto (dummy):', error?.message || error);
        return null;
    }
}

export async function makeManualPrediction(data: TPythonManualPredictionRequest): Promise<TPythonManualPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Parse CSV dengan papaparse
        const parsedCSV = papaparse.parse<Record<string, any>>(data.csv_string, { header: true });

        // Ambil daftar nilai dan ubah jadi angka, fallback ke 0 kalau gagal
        const amountList = parsedCSV.data
            .map(v => Number(v[data.value_column]))
            .filter(v => !isNaN(v))
            .map(v => Math.max(0, v)); // Pastikan tidak negatif

        // Hitung rata-rata dan nilai terakhir
        const averageAmount = amountList.length > 0
            ? amountList.reduce((sum, val) => sum + val, 0) / amountList.length
            : 0;

        const lastAmount = amountList.length > 0
            ? amountList[amountList.length - 1]
            : 0;

        // Return prediksi dummy (misalnya random di antara avg dan last)
        return generateDummyPrediction({
            // minValue: Math.min(averageAmount, lastAmount),
            lastValue: Math.max(0, lastAmount),
            averageValue: Math.max(0, averageAmount),
            steps,
        });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateAutoPrediction(data: TPythonAutoPredictionRequest): Promise<TPythonAutoPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Parse CSV dengan papaparse
        const parsedCSV = papaparse.parse<Record<string, any>>(data.csv_string, { header: true });

        // Ambil daftar nilai dan ubah jadi angka, fallback ke 0 kalau gagal
        const amountList = parsedCSV.data
            .map(v => Number(v[data.value_column]))
            .filter(v => !isNaN(v))
            .map(v => Math.max(0, v)); // Pastikan tidak negatif

        // Hitung rata-rata dan nilai terakhir
        const averageAmount = amountList.length > 0
            ? amountList.reduce((sum, val) => sum + val, 0) / amountList.length
            : 0;

        const lastAmount = amountList.length > 0
            ? amountList[amountList.length - 1]
            : 0;

        // Return prediksi dummy (misalnya random di antara avg dan last)
        return generateDummyPrediction({
            // minValue: Math.min(averageAmount, lastAmount),
            lastValue: Math.max(0, lastAmount),
            averageValue: Math.max(0, averageAmount),
            steps,
        });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/auto:', error?.response?.data || error.message);
        return null;
    }
}

export async function makePrivateManualPrediction(data: TPythonManualPredictionRequest): Promise<TPythonManualPredictionResponse | null> {
    try {
        const steps = data.future_step;

        // Parse CSV dengan papaparse
        const parsedCSV = papaparse.parse<Record<string, any>>(data.csv_string, { header: true });

        // Ambil daftar nilai dan ubah jadi angka, fallback ke 0 kalau gagal
        const amountList = parsedCSV.data
            .map(v => Number(v[data.value_column]))
            .filter(v => !isNaN(v))
            .map(v => Math.max(0, v)); // Pastikan tidak negatif

        // Hitung rata-rata dan nilai terakhir
        const averageAmount = amountList.length > 0
            ? amountList.reduce((sum, val) => sum + val, 0) / amountList.length
            : 0;

        const lastAmount = amountList.length > 0
            ? amountList[amountList.length - 1]
            : 0;

        // Return prediksi dummy (misalnya random di antara avg dan last)
        return generateDummyPrediction({
            // minValue: Math.min(averageAmount, lastAmount),
            lastValue: Math.max(0, lastAmount),
            averageValue: Math.max(0, averageAmount),
            steps,
        });
    } catch (error: any) {
        console.error('Gagal memanggil /predict/manual:', error?.response?.data || error.message);
        return null;
    }
}