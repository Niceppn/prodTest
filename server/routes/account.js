const express = require('express');
const router = express.Router();

// Lazy load controller to avoid potential circular dependency
let accountController;
try {
    accountController = require('../controller/accountController');
    console.log('accountController loaded:', accountController);
} catch (err) {
    console.error('Error loading accountController:', err);
    throw err;
}

router.post('/accounts', accountController.create);
router.get('/accounts', accountController.getAll);

module.exports = router;