import express from 'express'
var router = express.Router();
import transactionController from '../../controller/api/transactionController';
import authenticate from '../../middleware/authMiddleware';

router.post('/restocks', authenticate, transactionController.createRestockRecord);
router.post('/transactions', authenticate, transactionController.createTransactionRecord);
router.get('/restocks-history', authenticate, transactionController.showRestockHistoryRoute);
router.get('/sales-history', authenticate, transactionController.showSalesHistoryRoute);

export default router