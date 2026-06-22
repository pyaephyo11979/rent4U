const userController = require('../controllers/user_controller');
const express = require('express');
const router = express.Router();

const {authenticateToken} = require('../middlewares/auth_middlewares');
const checkRole = require('../middlewares/roleCheck');


router.get('/users', authenticateToken,checkRole('admin'), userController.getUsers);
router.get('/users/:id',authenticateToken,userController.getUser)
router.post('/users', authenticateToken, checkRole('admin'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);


module.exports = router;