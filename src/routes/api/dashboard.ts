import express from 'express'
var router = express.Router();
import dashboardController from '../../controller/api/dashboardController'
import authenticate from '../../middleware/authMiddleware';

router.get('/dashboard', authenticate, dashboardController.dashboardDataController)
router.get('/dashboard/trend/:period_type', authenticate, dashboardController.dashboardTrendController)
router.get('/dashboard/latest/:trx_type/:period_type', authenticate, dashboardController.dashboardLatestPredictionController)

export default router