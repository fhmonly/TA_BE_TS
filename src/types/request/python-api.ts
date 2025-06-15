type TPythonBasePredictionRequest = {
    csv_string: string
    prediction_period: "weekly" | "monthly"
    value_column: string
    date_column?: string
    date_regroup?: boolean
}

type TPythonBasePredictionResponse = {
    arima_order: [number, number, number]
    upper: number[]
    lower: number[]
    prediction: number[]
    success: boolean
}

export type TPythonAutoPredictionRequest = TPythonBasePredictionRequest
export type TPythonAutoPredictionResponse = TPythonBasePredictionResponse & {
    rmse: number
    mape: number
}

export type TPythonManualPredictionResponse = TPythonBasePredictionResponse
export type TPythonManualPredictionRequest = TPythonBasePredictionRequest & {
    arima_model?: [number, number, number]
}