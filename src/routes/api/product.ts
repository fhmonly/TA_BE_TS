import express from 'express'
var router = express.Router();
import productController from '../../controller/api/productsController';
import authenticate from '../../middleware/authMiddleware';

router.use('/', authenticate)
router.post('/product', productController.addProduct);
router.get('/product/:product_code', productController.getProductByProductCodeRoute);
router.get('/products', productController.showAllProducts);
router.get('/product/:id', productController.getProductDetail);
router.patch('/product/:id', productController.updateProductRoute);
router.delete('/product/:id', productController.deleteProductRoute);

export default router