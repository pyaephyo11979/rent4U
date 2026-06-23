const houseService = require('./house.service');
const { houseCreateSchema, houseUpdateSchema, houseQuerySchema, houseIdSchema } = require('./house.validator');
const { successResponse, paginatedResponse } = require('../../utils/response');

async function getHouses(req, res, next) {
  try {
    const query = houseQuerySchema.parse(req.query);
    const { houses, total, page, limit } = await houseService.findAll(query);
    res.json(paginatedResponse(houses, { page, limit, total }));
  } catch (err) {
    next(err);
  }
}

async function getHouse(req, res, next) {
  try {
    const { id } = houseIdSchema.parse(req.params);
    const house = await houseService.findById(id);
    res.json(successResponse(house));
  } catch (err) {
    next(err);
  }
}

async function createHouse(req, res, next) {
  try {
    const data = houseCreateSchema.parse(req.body);
    const house = await houseService.create(data, req.user.id);
    res.status(201).json(successResponse(house, 'House listed successfully'));
  } catch (err) {
    next(err);
  }
}

async function updateHouse(req, res, next) {
  try {
    const { id } = houseIdSchema.parse(req.params);
    const data = houseUpdateSchema.parse(req.body);
    const house = await houseService.update(id, data, req.user);
    res.json(successResponse(house, 'House updated'));
  } catch (err) {
    next(err);
  }
}

async function deleteHouse(req, res, next) {
  try {
    const { id } = houseIdSchema.parse(req.params);
    await houseService.remove(id, req.user);
    res.json(successResponse(null, 'House deleted'));
  } catch (err) {
    next(err);
  }
}

module.exports = { getHouses, getHouse, createHouse, updateHouse, deleteHouse };
