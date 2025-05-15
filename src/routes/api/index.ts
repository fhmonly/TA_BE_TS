import express from 'express'
var router = express.Router();

import authEndpoint from './auth'
import supplierEndpoint from './supplier'
import authenticate from '../../middleware/authMiddleware';
// import productCategory from '../../controller/api/productCategoriesController';
// import product from '../../controller/api/productsController';
// import stockForecastingController from '../../controller/api/stockForecasting';
// import stockPurchaseController from '../../controller/api/stockPurchases';
// import supplierController from '../../controller/api/suppliers';
// import transactionController from '../../controller/api/transactions';
// import userFileController from '../../controller/api/userFiles';
// const {jwtInfluencerMiddleware} = require("../middleware/authMiddleware");

router.get('/', function (req, res, next) {
    res.send('Read docs.');
});

router.use('/auth', authEndpoint)

router.use('/is-authenticated', authenticate)
router.get('/is-authenticated', (req, res) => {
    res.status(200).json({
        success: true,
    })
})

router.use('/', supplierEndpoint)

export default router;
