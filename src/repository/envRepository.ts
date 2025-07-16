import { db } from "../database/MySQL";
import { IEnvTable } from "../types/db-model";

export async function selectBackendURL() {
    const value = await db<IEnvTable>('env')
        .where({
            name: 'python_url'
        })
        .select('value')
        .first()
    return value?.value
}

export function updateBackendUrl(
    value: IEnvTable['value'],
) {
    return db<IEnvTable>('env')
        .where({
            name: 'python_url',
        })
        .update({
            value
        })
}