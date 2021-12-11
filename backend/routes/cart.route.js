const cartRoute = require('express').Router();
const Cart = require('../models/Cart');

cartRoute.route('/').get((req, res, next) => {
  Cart.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
});

cartRoute.route('/:cartId').get((req, res, next) => {
  Cart.findById(req.params.cartId, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

cartRoute.post('/create', function (req, res, next) {
  const newCart = new Cart({
    cartItems: req.body._cartItems,
    timestamp: req.body._timestamp,
    totalAmount: req.body._totalAmount,
    totalAmountAfterDiscount: req.body._totalAmountAfterDiscount,
    currency: req.body._currency,
    exchange: req.body._exchange,
    vatRate: req.body._vatRate,
    active: req.body._active,
    ordered: req.body._ordered
  });

  try {
    newCart.save().then(cart => {
      res.json({
        cartId: cart._id
      });
    });
  } catch (err) {
    res.json({msg: err});
  }
});

cartRoute.route('/update/:cartId').put((req, res, next) => {
  Cart.findByIdAndUpdate(req.params.cartId, {
    $set: req.body
  }, {new: true}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

module.exports = cartRoute;
