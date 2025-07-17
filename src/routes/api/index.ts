import express from 'express'
var router = express.Router();

import authenticate from '../../middleware/authMiddleware';
import authRoute from '../../controller/api/authController';
import dashboardController from '../../controller/api/dashboardController'
import predictionController from '../../controller/api/predictionController'
import productCategoryController from '../../controller/api/productCategoriesController';
import productController from '../../controller/api/productsController';
import supplierController from '../../controller/api/suppliersController';
import transactionController from '../../controller/api/transactionController';


router.get('/', function (req, res, next) {
    res.send('Read docs.');
});

router.use('/is-authenticated', authenticate)
router.get('/is-authenticated', (req, res) => {
    res.status(200).json({
        success: true,
    })
})


router.post('/auth/register', authRoute.register);
router.post('/auth/login', authRoute.login);
router.post('/auth/forgot-password', authRoute.forgotPasswordSendEmail);
router.get('/auth/forgot-password/:token', authRoute.forgotPasswordVerifyToken);
router.patch('/auth/forgot-password/:token', authRoute.forgotPasswordChangePassword);
router.get('/auth/verify/:token', authRoute.verify);
router.post('/auth/re-send-email-activation/:token', authRoute.resendEmailVerification);
router.get('/auth/refresh-token', authRoute.refreshToken);
router.get('/auth/logout', authenticate, authRoute.logout);

router.get('/dashboard', authenticate, dashboardController.dashboardDataController)
router.get('/dashboard/trend/:period_type', authenticate, dashboardController.dashboardTrendController)
router.get('/dashboard/latest/:trx_type/:period_type', authenticate, dashboardController.dashboardLatestPredictionController)

router.post('/prediction-from-file', predictionController.filePrediction)
router.get('/saved-predictions/purchases/:period_type', authenticate, predictionController.getSavedPurchasePredictions)
router.get('/saved-predictions/sales/:period_type', authenticate, predictionController.getSavedSalePredictions)
router.post('/purchase-prediction/:product_id', authenticate, predictionController.purchasePrediction)
router.post('/sales-prediction/:product_id', authenticate, predictionController.salesPrediction)
router.post('/smart-prediction/:product_id', authenticate, predictionController.smartPrediction)
router.post('/detail-prediction', authenticate, predictionController.predictionDetail)

router.post('/product-category', authenticate, productCategoryController.addProductCategory);
router.post('/product-category/:id', authenticate, productCategoryController.addProductCategory);
router.get('/product-categories', authenticate, productCategoryController.getProductCategories);
router.delete('/product-category/:id', authenticate, productCategoryController.deleteProductCategoryRoute);

router.post('/product', authenticate, productController.addProduct);
router.get('/product/:product_code', authenticate, productController.getProductByProductCodeRoute);
router.get('/products', authenticate, productController.showAllProducts);
router.get('/all-products/limited', authenticate, productController.getAllProduct);
router.get('/product-get-by-id/:id', authenticate, productController.getProductDetail);
router.patch('/product/:id', authenticate, productController.updateProductRoute);
router.delete('/product/:id', authenticate, productController.deleteProductRoute);
router.get('/product-low-stock', authenticate, productController.getLowStockProduct)

router.post('/supplier', authenticate, supplierController.addSupplier);
router.get('/suppliers', authenticate, supplierController.showAllSupplier);
router.get('/supplier/:id', authenticate, supplierController.getSupplierDetail);
router.patch('/supplier/:id', authenticate, supplierController.updateSupplierRoute);
router.delete('/supplier/:id', authenticate, supplierController.deleteSupplierRoute);

router.post('/restocks', authenticate, transactionController.createRestockRecord);
router.post('/transactions', authenticate, transactionController.createTransactionRecord);
router.get('/restocks-history', authenticate, transactionController.showRestockHistoryRoute);
router.get('/sales-history', authenticate, transactionController.showSalesHistoryRoute);

export default router;
