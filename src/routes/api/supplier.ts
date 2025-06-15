import express from 'express'
var router = express.Router();
import supplierController from '../../controller/api/suppliersController';
import authenticate from '../../middleware/authMiddleware';

router.post('/supplier', authenticate, supplierController.addSupplier);
router.get('/suppliers', authenticate, supplierController.showAllSupplier);
router.get('/supplier/:id', authenticate, supplierController.getSupplierDetail);
router.patch('/supplier/:id', authenticate, supplierController.updateSupplierRoute);
router.delete('/supplier/:id', authenticate, supplierController.deleteSupplierRoute);

export default router