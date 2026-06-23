const userService = require('./user.service');
const { userUpdateSchema, userIdSchema } = require('./user.validator');
const { successResponse } = require('../../utils/response');

async function getUsers(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json(successResponse(users));
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = userIdSchema.parse(req.params);
    const user = await userService.findById(id);
    res.json(successResponse(user));
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = userIdSchema.parse(req.params);
    const data = userUpdateSchema.parse(req.body);
    const user = await userService.update(id, data, req.user);
    res.json(successResponse(user, 'User updated'));
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = userIdSchema.parse(req.params);
    await userService.remove(id);
    res.json(successResponse(null, 'User deleted'));
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, getUser, updateUser, deleteUser };
