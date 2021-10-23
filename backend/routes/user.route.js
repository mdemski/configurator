const userRoute = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const utils = require('../lib/utils');

userRoute.get('/protected', passport.authenticate('jwt', {session: false}, function (req, res, next) {
  res.status(200).json({success: true, msg: 'You are successfully authenticated to this route!'});
}))

//Get All Users
userRoute.route('/').get(((req, res, next) => {
  User.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Get single user
// TODO dodałem next do tych funkcji mogą stanowic problem do usunięcia
userRoute.route('/:userId').get(((req, res, next) => {
  User.findById(req.params.userId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Login user
userRoute.post('/login', function (req, res, next) {
  User.findOne({email: req.body._email})
    .then((user) => {
      if (!user) {
        return res.status(401).json({success: false, msg: 'Could not find user'});
      }

      const isValid = utils.validPassword(req.body._password, user.hash, user.salt);

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({success: true, token: tokenObject.token, expiresIn: tokenObject.expires});
      } else {
        res.status(401).json({success: false, msg: 'Wrong password'});
      }
    })
})

//Register a new user
userRoute.post('/register', function (req, res, next) {
  console.log(req.body)
  const saltHash = utils.genPassword(req.body._password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const newUser = new User({
    email: req.body._email,
    hash: hash,
    salt: salt,
    role: req.body._role,
    activated: req.body._activated,
    uuid: req.body._uuid,
    discount: req.body._discount,
    companyNip: req.body._companyNip
  });

  try {
    newUser.save().then(user => res.json({success: true, user: user}));
  } catch (err) {
    res.json(({success: false, msg: err}));
  }
})

//Update user
userRoute.route('/update/:userId').put(((req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
      console.log(req.params.userId + ' successfully updated')
    }
  })
}))

//Delete user
userRoute.route('/delete/:userId').delete(((req, res, next) => {
  User.findByIdAndRemove(req.params.userId, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
}))

module.exports = userRoute;
