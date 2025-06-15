import express from 'express'
var router = express.Router();
import productController from '../../controller/api/productCategoriesController';
import authenticate from '../../middleware/authMiddleware';

router.post('/product-category', authenticate, productController.addProductCategory);
router.post('/product-category/:id', authenticate, productController.addProductCategory);
router.get('/product-categories', authenticate, productController.getProductCategories);
router.delete('/product-category/:id', authenticate, productController.deleteProductCategoryRoute);

export default router