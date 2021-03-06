const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

//VALIDATION

//check if the deliverTo property is missing
const bodyHasDeliverTo = (req, res, next) => {
  const { data: { deliverTo } = {} } = req.body;

  if (deliverTo) {
    res.locals.deliverTo = deliverTo;
    return next();
  }
  next({
    status: 400,
    message: 'Order must include a deliverTo.'
  });
}

//check if the mobileNumber property is missing
const bodyHasMobileNumber = (req, res, next) => {
  const { data: { mobileNumber } = {} } = req.body;

  if (mobileNumber) {
    res.locals.mobileNumber = mobileNumber;
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
    res.locals.dishes = dishes;
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

//checks if order exists
const orderExists = (req, res, next) => {
  const { orderId } = req.params;
  const desiredOrder = orders.find((order) => orderId === order.id);

  if (desiredOrder) {
    res.locals.orderId = orderId;
    res.locals.order = desiredOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order with id ${orderId} does not exist.`,
  });
}

//checks if body id matches order route id
const bodyIdMatchesOrderId = (req, res, next) => {
  const { data: { id } = {} } = req.body;
  const { orderId } = req.params;

  if (id) {
    if (orderId === id) {
      res.locals.id = id;
      return next();
    }
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
  next();
}

//check if body status property is missing
const bodyHasStatusProperty = (req, res, next) => {
  const { data: { status } = {} } = req.body;
  const statusMessages = [
    'pending',
    'preparing',
    'out-for-delivery',
    'delivered',
  ];

  if (status) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Order must have a status of ${statusMessages}.`,
  });
}

//check if status is valid
const statusIsValid = (req, res, next) => {
  const { data: { status } = {} } = req.body;

  if (status === "pending" || status === "preparing" || status === "out-for-delivery" || status === "delivered") {
    return next();
  }
  next({
    status: 400,
    message: 'Order must have a status of pending, preparing, out-for-delivery, delivered'
  });
}

//check if order is in the pending status
const statusIsPending = (req, res, next) => {

  if (res.locals.order.status === 'pending') {
    return next();
  }
  next({
    status: 400,
    message: 'An order cannot be deleted unless it is pending'
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
    deliverTo: res.locals.deliverTo,
    mobileNumber: res.locals.mobileNumber,
    status: res.locals.status,
    dishes: res.locals.dishes,
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//GET /orders/:orderId
const read = (req, res) => {
  res.status(200).json({ data: res.locals.order });
}

//PUT /orders/:orderId
function update(req, res) {
  const desiredOrder = res.locals.order;

  if (desiredOrder.deliverTo !== res.locals.deliverTo) {
    desiredOrder.deliverTo = res.locals.deliverTo;
  }
  if (desiredOrder.mobileNumber !== res.locals.mobileNumber) {
    desiredOrder.mobileNumber = res.locals.mobileNumber;
  }
  if (desiredOrder.status !== res.locals.status) {
    desiredOrder.status = res.locals.status;
  }
  if (desiredOrder.dishes !== res.locals.dishes) {
    desiredOrder.dishes = res.locals.dishes;
  }
  res.status(200).json({ data: desiredOrder });
}

//DELETE /orders/:orderId
const remove = (req, res) => {
  const index = orders.findIndex((order) => order.id === res.locals.orderId);

  orders.splice(index, 1);
  res.sendStatus(204)
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
  read: [orderExists, read],
  update: [
    orderExists,
    bodyIdMatchesOrderId,
    bodyHasDeliverTo,
    bodyHasMobileNumber,
    bodyHasDishes,
    dishesPropertyIsArray,
    dishesArrayIsNotEmpty,
    dishHasQuantityProperty,
    dishQuantityIsGreaterThanZero,
    dishQuantityIsInteger,
    bodyHasStatusProperty,
    statusIsValid,
    update
  ],
  remove: [
    orderExists,
    statusIsPending,
    remove
  ]
};