const router = require('express').Router();
const usersController = require('../controllers/user');
const requireAuth = require('../middleware/requireAuth');
const requireRoles = require('../middleware/requireRoles');
const ROLES_LIST = require('../config/rolesList');

// Public route for Guest
router.route('/guest').get(usersController.Guest);

// Protected routes (require authentication)
router.use(requireAuth);
router.use(requireRoles([ROLES_LIST.Staff, ROLES_LIST.Admin]));

router.route('/')
    .get(usersController.getAll)
    .post(usersController.create)
    .patch(usersController.update);

router.route('/:id')
    .delete(usersController.delete);

module.exports = router;
