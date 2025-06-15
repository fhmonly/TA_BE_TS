import express from 'express'
var router = express.Router();
import productController from '../../controller/api/productsController';
import authenticate from '../../middleware/authMiddleware';

router.post('/product', authenticate, productController.addProduct);
router.get('/product/:product_code', authenticate, productController.getProductByProductCodeRoute);
router.get('/products', authenticate, productController.showAllProducts);
router.get('/all-products/limited', authenticate, productController.getAllProduct);
router.get('/product-get-by-id/:id', authenticate, productController.getProductDetail);
router.patch('/product/:id', authenticate, productController.updateProductRoute);
router.delete('/product/:id', authenticate, productController.deleteProductRoute);
router.get('/product-low-stock', authenticate, productController.getLowStockProduct)

export default router