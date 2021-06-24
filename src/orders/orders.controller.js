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
    message: 'Order must include a deliverTo.'
  })
}

//check if the mobileNumber property is missing
const bodyHasMobileNumber = (req, res, next) => {
  const { data: { mobileNumber } = {} } = req.body;

  if (mobileNumber) {
    req.mobileNumber = mobileNumber;
    return next();
  }
  next({
    status: 400,
    message: 'Order must include a mobileNumber.'
  });
}

//check if the dishes property is missing
const bodyHasDishes = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  if (dishes) {
    req.dishes = dishes;
    return next();
  }
  next({
    status: 400,
    message: 'Order must include a dish.'
  });
}

//checks if the dishes property is an array
const dishesPropertyIsArray = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  if (Array.isArray(dishes)) {
    return next();
  }
  next({
    status: 400,
    message: 'Order must include at least one dish.',
  });
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
  create: [
    bodyHasDeliverTo,
    bodyHasMobileNumber,
    bodyHasDishes,
    dishesPropertyIsArray,
    create
  ],
}