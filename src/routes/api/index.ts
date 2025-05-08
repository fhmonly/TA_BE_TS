import express from 'express'
var router = express.Router();

import authEndpoint from './auth'
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

// ----- Product Categories
// router.post("/product-category", productCategory.createCategory);
// router.get("/product-categories", productCategory.getCategories);
// router.get("/product-category/:id", productCategory.getCategory);
// router.patch("/product-category/:id", productCategory.updateCategory);
// router.delete("/product-category/:id", productCategory.deleteCategory);


// ----- Products
// router.get("/product/:id", product.getProduct);
// router.post("/product", product.createProduct);
// router.patch("/product/:id", product.updateProduct);
// router.delete("/product/:id", product.deleteProduct);
// router.get("/products", product.getProducts);


// ----- Stock Forecasting
// router.post("/stock-forecasting", stockForecastingController.createStockForecasting);
// router.get("/stock-forecasting", stockForecastingController.getStockForecastingByDate);
// router.get("/stock-forecasting/history", stockForecastingController.getStockForecastings);


// ----- Stock Purchases
// router.post("/stock-purchase", stockPurchaseController.createStockPurchase);
// router.patch("/stock-purchase/:id", stockPurchaseController.updateStockPurchase);
// router.delete("/stock-purchase/:id", stockPurchaseController.deleteStockPurchase);
// router.get("/stock-purchase/:id", stockPurchaseController.getStockPurchase);
// router.get("/stock-purchase", stockPurchaseController.getStockPurchases);


// ----- Suppliers
// router.post("/supplier", supplierController.createSupplier);
// router.patch("/supplier/:id", supplierController.updateSupplier);
// router.delete("/supplier/:id", supplierController.deleteSupplier);
// router.get("/supplier/:id", supplierController.getSupplier);
// router.get("/supplier", supplierController.getSuppliers);


// ----- Transactions
// router.post("/transaction", transactionController.createTransaction);
// router.patch("/transaction/:id", transactionController.updateTransaction);
// router.delete("/transaction/:id", transactionController.deleteTransaction);
// router.get("/transaction/:id", transactionController.getTransaction);
// router.get("/transaction", transactionController.getTransactions);

// ----- userFile
// router.post("/user-files", userFileController.createUserFile);
// router.patch("/user-files/:id", userFileController.updateUserFile);
// router.delete("/user-files/:id", userFileController.deleteUserFile);
// router.get("/user-files/:id", userFileController.getUserFile);
// router.get("/user-files", userFileController.getUserFiles);

export default router;
