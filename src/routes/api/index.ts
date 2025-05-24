import express from 'express'
var router = express.Router();

import authEndpoint from './auth'
import supplierEndpoint from './supplier'
import productCategoryEndpoint from './product_category'
import trxEndpoint from './trx'
import productEndpoint from './product'
import authenticate from '../../middleware/authMiddleware';

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
router.use('/', productEndpoint)
router.use('/', productCategoryEndpoint)
router.use('/', trxEndpoint)

export default router;
