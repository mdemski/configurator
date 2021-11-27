const addressRoute = require('express').Router()
const Address = require('../models/Address');

//Add address
addressRoute.route('/add').post((req, res, next) => {
  const newAddress = new Address({
    firstName: req.body._firstName,
    lastName: req.body._lastName,
    phoneNumber: req.body._phoneNumber,
    street: req.body._street,
    localNumber: req.body._localNumber,
    zipCode: req.body._zipCode,
    city: req.body._city,
    country: req.body._country
  })
  try {
    newAddress.save().then(address => res.json({success: true, address: address}))
  } catch (err) {
    res.json({success: false, msg: err})
  }
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
  }, {new: true}, (error, data) => {
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
