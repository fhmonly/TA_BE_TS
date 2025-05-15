import express from 'express'
var router = express.Router();
import supplierController from '../../controller/api/suppliersController';
import authenticate from '../../middleware/authMiddleware';

router.use('/', authenticate)
router.post('/supplier', supplierController.addSupplier);
router.get('/suppliers', supplierController.showAllSupplier);
router.get('/supplier/:id', supplierController.getSupplierDetail);
router.patch('/supplier/:id', supplierController.updateSupplierRoute);
router.delete('/supplier/:id', supplierController.deleteSupplierRoute);

export default router