import express from 'express'
var router = express.Router();
import productController from '../../controller/api/productCategoriesController';
import authenticate from '../../middleware/authMiddleware';

router.use('/', authenticate)
router.post('/product-category', productController.addProductCategory);
router.post('/product-category/:id', productController.addProductCategory);
router.get('/product-categories', productController.getProductCategories);
router.delete('/product-category/:id', productController.deleteProductCategoryRoute);

export default router