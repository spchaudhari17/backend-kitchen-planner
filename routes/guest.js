const router = require('express').Router();
const usersController = require('../controllers/user');

// Public route for Guest browsing
router.route('/').get(usersController.Guest);

module.exports = router; 
