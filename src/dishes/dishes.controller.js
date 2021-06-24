const { response } = require("express");
const path = require("path");

const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

//VALIDATION

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


//Routes
//GET /dishes
const list = (req, res, next) => {
  res.status(200).json({ data: dishes })
}

//POST /dishes
const create = (req, res, next) => {
  const newDish = {
    'id': req.id,
    'name': req.name,
    'description': req.description,
    'price': req.price,
    'image_url': req.image_url
  }
  dishes.push(newDish)
  response.status(201).json({ data: newDish })
}



module.exports = {
  list,
  create: [bodyHasName, bodyHasDescription]
}