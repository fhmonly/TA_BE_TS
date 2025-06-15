import { IPredictionModelTable } from "../../types/db-model";

export function shouldUseAutoModel(model: IPredictionModelTable | undefined, isExpired: boolean) {
    return !model || isExpired
}