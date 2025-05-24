import express from 'express'
var router = express.Router();
import transactionController from '../../controller/api/transactionController';
import authenticate from '../../middleware/authMiddleware';

router.use('/', authenticate)
router.post('/restocks', transactionController.createRestockRecord);
router.post('/transactions', transactionController.createTransactionRecord);
router.get('/restocks-history', transactionController.showRestockHistoryRoute);
router.get('/sales-history', transactionController.showSalesHistoryRoute);

export default router