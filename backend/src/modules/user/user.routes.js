const { Router } = require('express');
const userController = require('./user.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();

router.get('/', authenticate, authorize('Admin'), userController.getUsers);
router.get('/:id', authenticate, userController.getUser);
router.patch('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);

module.exports = router;
