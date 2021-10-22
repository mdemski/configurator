const addressRoute = require('express').Router()
const Address = require('../models/Address');

//Add address
addressRoute.route('/add').post((req, res, next) => {
  Address.create(req.body, (error, data) => {
    if (error){
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get All addresses
// TODO dodałem next do tych funkcji mogą stanowic problem do usunięcia
addressRoute.route('/').get(((req, res, next) => {
  Address.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Get single address
// TODO dodałem next do tych funkcji mogą stanowic problem do usunięcia
addressRoute.route('/:addressId').get(((req, res, next) => {
  Address.findById(req.params.addressId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Update address
addressRoute.route('/update/:addressId').put(((req, res, next) => {
  Address.findByIdAndUpdate(req.params.addressId, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
      console.log(req.params.addressId + ' successfully updated')
    }
  })
}))

//Delete address
addressRoute.route('/delete/:addressId').delete(((req, res, next) => {
  Address.findByIdAndRemove(req.params.addressId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
}))

module.exports = addressRoute;
