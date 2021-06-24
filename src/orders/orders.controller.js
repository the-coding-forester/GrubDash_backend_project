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

//check if the dishes array is not empty
const dishesArrayIsNotEmpty = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  if (dishes.length > 0) {
    return next();
  }
  next({
    status: 400,
    message: 'Order must include at least one dish.'
  });
}

//check if the dish quantity property is missing
const dishHasQuantityProperty = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  dishes.forEach((dish, index) => {
    if (!dish.quantity) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`
      });
    }
  });
  next();
}

//check if dish quantity is greater than zero
const dishQuantityIsGreaterThanZero = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  dishes.forEach((dish, index) => {
    if (dish.quantity < 1) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`
      });
    };
  })
  next();
}

//check if dish quantity is an integer
const dishQuantityIsInteger = (req, res, next) => {
  const { data: { dishes } = {} } = req.body;

  dishes.forEach((dish, index) => {
    if (!Number.isInteger(dish.quantity)) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`
      });
    }
  });
  next();
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
    dishesArrayIsNotEmpty,
    dishHasQuantityProperty,
    dishQuantityIsGreaterThanZero,
    dishQuantityIsInteger,
    create
  ],
}