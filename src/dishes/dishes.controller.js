const { response } = require("express");
const path = require("path");

const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

//VALIDATION Middleware

//check that the name property exists
const bodyHasName = (req, res, next) => {
  const { data: { name } = {} } = req.body;

  if (name) {
    req.name = name;
    return next();
  }
  next({
    status: 400,
    message: 'Dish must include a name.',
  });
}

//checks that the description property exists
const bodyHasDescription = (req, res, next) => {
  const { data: { description } = {} } = req.body;

  if (description) {
    req.description = description;
    return next();
  }
  next({
    status: 400,
    message: 'Dish must include a description.',
  });
}

//checks that the price property exists
const bodyHasPrice = (req, res, next) => {
  const { data: { price } = {} } = req.body;

  if (price) {
    req.price = price;
    return next();
  }
  next({
    status: 400,
    message: 'Dish must include a price',
  });
}

//check that the price property is an integer
const priceIsAnInteger = (req, res, next) => {
  const { data: { price } = {} } = req.body;

  if (Number.isInteger(price)) {
    return next();
  }
  next({
    status: 400,
    message: 'Dish must have a price that is a number/integer.',
  });
}

//checks that the price property is greater than 0
const priceIsGreaterThanZero = (req, res, next) => {
  const { data: { price } = {} } = req.body;

  if (price > 0) {
    return next();
  }
  next({
    status: 400,
    message: 'Dish must have a price that is greater than 0.',
  });
}

//checks if the image_url property exists
const bodyHasImageUrl = (req, res, next) => {
  const { data: { image_url } = {} } = req.body;

  if (image_url) {
    req.image_url = image_url;
    return next();
  }
  next({
    status: 400,
    message: 'Dish must have an image_url.'
  });
}

//checks if dish exists
const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  const desiredDish = dishes.find((dish) => dishId === dish.id);

  if (desiredDish) {
    req.dishId = dishId;
    req.dish = desiredDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish with id ${id} does not exist.`,
  });
}

//checks if body id matches dish route id
const bodyIdMatchesDishId = (req, res, next) => {
  const { data: { id } = {} } = req.body;
  const { dishId } = req.params;

  if (id) {
    if (dishId === id) {
      req.id = id;
      return next();
    }
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  next();
}

//Handler Middleware
//GET /dishes
const list = (req, res) => {
  res.status(200).json({ data: dishes })
}

//POST /dishes
const create = (req, res) => {
  const newDish = {
    'id': nextId(),
    'name': req.name,
    'description': req.description,
    'price': req.price,
    'image_url': req.image_url
  };
  dishes.push(newDish)
  res.status(201).json({ data: newDish })
}

//GET /dishes/:dishId
const read = (req, res) => {
  res.status(200).json({ data: req.dish });
}


module.exports = {
  list,
  create: [
    bodyHasName,
    bodyHasDescription,
    bodyHasPrice,
    priceIsAnInteger,
    priceIsGreaterThanZero,
    bodyHasImageUrl,
    create
  ],
  read: [
    dishExists,
    read
  ],
  update: [
    dishExists,
    bodyIdMatchesDishId,
    bodyHasName,
    bodyHasDescription,
    bodyHasPrice,
    priceIsAnInteger,
    priceIsGreaterThanZero,
    bodyHasImageUrl,
    update
  ]
};