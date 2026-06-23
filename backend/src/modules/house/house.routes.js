const { Router } = require('express');
const houseController = require('./house.controller');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

const router = Router();

router.get('/', houseController.getHouses);
router.get('/:id', houseController.getHouse);
router.post('/', authenticate, authorize('Host', 'Admin'), houseController.createHouse);
router.patch('/:id', authenticate, houseController.updateHouse);
router.delete('/:id', authenticate, houseController.deleteHouse);

module.exports = router;
