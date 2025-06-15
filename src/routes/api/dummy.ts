import express from 'express'
var router = express.Router();
import dummyController from '../../controller/api/dummyController'
import authenticate from '../../middleware/authMiddleware';

router.get('/dummies/purchases/:period_type', authenticate, dummyController.getPurchasesDummy)
router.get('/dummies/sales/:period_type', authenticate, dummyController.getSalesDummy)
router.post('/dummy', authenticate, dummyController.createDummy)
router.patch('/dummy/:id', authenticate, dummyController.updateDummyController)

export default router