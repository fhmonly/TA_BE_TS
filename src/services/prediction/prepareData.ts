import createHttpError from 'http-errors'
import papaparse from 'papaparse'
import { selectDummy } from '../../repository/dummyRepository'
import { selectGroupedDailyPurchase, selectGroupedMonthlyPurchase, selectGroupedWeeklyPurchase } from '../../repository/transaction/purchase'
import { selectGroupedDailySales, selectGroupedMonthlySales, selectGroupedWeeklySales } from '../../repository/transaction/sales'

export async function preparePredictionData(product_id: number, prediction_period: 'weekly' | 'monthly', source: 'purchases' | 'sales') {
    let groupedData
    if (prediction_period === 'weekly') {
        if (source === 'purchases') {
            groupedData = await selectGroupedWeeklyPurchase(product_id)
        } else if (source === 'sales') {
            groupedData = await selectGroupedWeeklySales(product_id)
        }
    } else if (prediction_period === 'monthly') {
        if (source === 'purchases') {
            groupedData = await selectGroupedMonthlyPurchase(product_id)
        } else if (source === 'sales') {
            groupedData = await selectGroupedMonthlySales(product_id)
        }
    }

    if (!groupedData || groupedData.length === 0) {
        throw createHttpError(404, `Minimal lakukan 1 ${source === 'purchases' ? 'pembelian' : 'penjualan'} product dan lakukan prediksi di ${prediction_period === 'monthly' ? 'bulan' : 'minggu'} berikutnya`)
    }

    let data = groupedData.map(v => ({ amount: v.amount }))

    if (groupedData.length < 10) {
        const dummy = await selectDummy(product_id, prediction_period, source)
        if (!dummy?.fake_json) {
            throw createHttpError(422, 'Prediksi tidak dapat dilakukan: data asli terlalu sedikit dan fallback data dummy tidak tersedia.')
        }

        const fakeJSON = dummy.fake_json.filter(v => v >= 1).map(v => ({ amount: v }))
        if (fakeJSON.length + groupedData.length < 11) {
            throw createHttpError(422, 'Prediksi tidak dapat dilakukan: total data (asli + dummy) masih kurang dari 11 periode.')
        }

        data.unshift(...fakeJSON)
    }

    const csv_string = papaparse.unparse(data)
    return csv_string
}

type PreparedDataReturnValue = {
    data_freq: 'daily' | 'weekly' | 'monthly'
    csv_string: string
}
export async function getPreparedCSVString(
    product_id: number,
    prediction_period: 'weekly' | 'monthly',
    source: 'purchases' | 'sales'
): Promise<PreparedDataReturnValue> {
    const returnValue: PreparedDataReturnValue = {
        data_freq: prediction_period,
        csv_string: ''
    }

    let groupedData
    if (prediction_period === 'weekly') {
        if (source === 'purchases') {
            groupedData = await selectGroupedWeeklyPurchase(product_id)
        } else {
            groupedData = await selectGroupedWeeklySales(product_id)
        }
    } else {
        if (source === 'purchases') {
            groupedData = await selectGroupedMonthlyPurchase(product_id)
        } else {
            groupedData = await selectGroupedMonthlySales(product_id)
        }
    }

    if (
        groupedData.length < 12
    ) {
        if (source === 'sales') {
            groupedData = await selectGroupedDailySales(
                product_id,
                prediction_period === 'weekly' ? 'last-week' : 'last-month'
            )

            if (groupedData.length < 30) {
                throw createHttpError(422, `Minimal lakukan 30 transaksi penjualan harian pada ${prediction_period === 'weekly' ? 'minggu' : 'bulan'} sebelumnya untuk dapat melakukan prediksi`)
            }
            returnValue.data_freq = 'daily'
        } else {
            throw createHttpError(422, `Minimal lakukan 12 transaksi pembelian ${prediction_period === 'weekly' ? 'mingguan' : 'bulanan'} untuk dapat melakukan prediksi`)
        }
    }


    let data = groupedData.map(v => ({ amount: v.amount }))

    returnValue.csv_string = papaparse.unparse(data)

    return returnValue
}