const express = require('express');
const app = express();
const configurationRoute = express.Router();

let SingleConfiguration = require('../models/SingleConfiguration');

//Add configuration
configurationRoute.route('/create').post((req, res, next) => {
  SingleConfiguration.create(req.body, (error, data) => {
    if (error){
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get All Configurations
// TODO dodałem next do tych funkcji mogą stanowic problem do usunięcia
configurationRoute.route('/').get(((req, res, next) => {
  SingleConfiguration.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Get single configuration
// TODO dodałem next do tych funkcji mogą stanowic problem do usunięcia
configurationRoute.route('/read/:configId').get(((req, res, next) => {
  SingleConfiguration.findById(req.params.configId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Update configuration
configurationRoute.route('/update/:configId').put(((req, res, next) => {
  SingleConfiguration.findByIdAndUpdate(req.params.configId, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
      console.log(req.params.configId + ' successfully updated')
    }
  })
}))

//Delete configuration
configurationRoute.route('/delete/:configId').delete(((req, res, next) => {
  SingleConfiguration.findByIdAndRemove(req.params.configId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
}))

module.exports = configurationRoute;
