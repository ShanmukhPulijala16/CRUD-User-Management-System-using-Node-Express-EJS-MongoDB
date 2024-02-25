const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');

/*
 * Customer Routes
*/
router.get('/', customerController.getHomePage);
router.get('/about', customerController.about);
// Add Customer GET Request
router.get('/add', customerController.addCustomer);
// Add Customer POST Request
router.post('/add', customerController.postCustomer);

router.get('/view/:id', customerController.view);
router.get('/edit/:id', customerController.edit);

router.put('/edit/:id', customerController.editPost);
router.delete('/edit/:id', customerController.deleteCustomer);

router.post('/search', customerController.searchCustomers);

module.exports = router;