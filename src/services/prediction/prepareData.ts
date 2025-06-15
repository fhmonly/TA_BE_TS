import createHttpError from 'http-errors'
import papaparse from 'papaparse'
import { selectGroupedMonthlyPurchase, selectGroupedWeeklyPurchase } from '../../repository/restockRepository'
import { selectDummy } from '../../repository/dummyRepository'

export async function preparePredictionData(product_id: number, prediction_period: 'weekly' | 'monthly', source: 'purchases' | 'sales') {
    let groupedData
    if (prediction_period === 'weekly') {
        groupedData = await selectGroupedWeeklyPurchase(product_id)
    } else {
        groupedData = await selectGroupedMonthlyPurchase(product_id)
    }

    if (!groupedData || groupedData.length === 0) {
        throw createHttpError(404, `Minimal lakukan 1 ${source === 'purchases' ? 'pembelian' : 'penjualan'} product dan lakukan prediksi di bulan berikutnya`)
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
