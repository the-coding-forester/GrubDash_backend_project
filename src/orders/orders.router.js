const router = require("express").Router();
const controller = require('./orders.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');

// orders/:orderId route (GET, PUT)
router
  .route('/:orderId')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.remove)
  .all(methodNotAllowed);

// orders route (GET, POST)
router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
