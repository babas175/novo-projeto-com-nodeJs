const express = require('express');
const productsController = require('../controller/productsController');

const router = express.Router();


router.get('/', productsController.getAPIDetails);
router.put('/products/:code', productsController.updateProductByCode);
router.delete('/products/:code', productsController.deleteProductByCode);
router.get('/products/:code', productsController.getProductByCode);
router.get('/products', productsController.listProducts);


module.exports = router;
