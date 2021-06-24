const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

//VALIDATION

//check if the deliverTo property is missing
const bodyHasDeliverTo = (req, res, next) => {
  const { data: { deliverTo } = {} } = req.body;

  if (deliverTo) {
    req.deliverTo = deliverTo;
    return next();
  }
  next({
    status: 400,
    message: 'Order must have a deliverTo property.'
  })
}

//HANDLER MIDDLEWARE

//GET /orders
const list = (req, res) => {
  res.status(200).json({ data: orders })
}

//POST /orders
const create = (req, res) => {
  const newOrder = {
    id: nextId(),
    deliverTo: req.deliverTo,
    mobileNumber: req.mobileNumber,
    status: req.status,
    dishes: req.dishes,
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

module.exports = {
  list,
  create: [bodyHasDeliverTo, create],
}