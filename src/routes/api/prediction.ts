import express from 'express'
var router = express.Router();
import predictionController from '../../controller/api/predictionController'
import authenticate from '../../middleware/authMiddleware';

router.post('/prediction-from-file', predictionController.filePrediction)
router.get('/saved-predictions/purchases/:period_type', authenticate, predictionController.getSavedPurchasePredictions)
router.get('/saved-predictions/sales/:period_type', authenticate, predictionController.getSavedSalePredictions)
router.post('/purchase-prediction/:product_id', authenticate, predictionController.purchasePrediction)
router.post('/sales-prediction/:product_id', authenticate, predictionController.salesPrediction)
export default router