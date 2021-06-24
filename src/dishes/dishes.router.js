const router = require("express").Router();
const controller = require('./dishes.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

// TODO: Implement the /dishes routes needed to make the tests pass

// dishes/:dishId route (GET, PUT)
router
  .route('/:dishId')
  .get(controller.read)
  .all(methodNotAllowed);

// dishes route (GET, POST)
router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
