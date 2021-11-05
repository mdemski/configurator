const userRoute = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const utils = require('../lib/utils');
const nodemailer = require("nodemailer");
const smtpConfig = require('../config/smtpConfig');

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

//Get single user by mongo ID
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

//Get single user by email
userRoute.route('/email/:email').get(((req, res, next) => {
  User.findOne({email: req.params.email}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Get single user by username
userRoute.route('/username/:username').get(((req, res, next) => {
  User.findOne({username: req.params.username}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Get single user by email
userRoute.route('/uuid/:uuid').get(((req, res, next) => {
  User.findOne({uuid: req.params.uuid}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
}))

//Login user
userRoute.post('/login', function (req, res, next) {
  User.findOne({email: req.body.email})
    .then((user) => {
      if (!user) {
        return res.status(401).json({success: false, msg: 'EMAIL_NOT_FOUND'});
      }
      if (!user.activated) {
        return res.status(401).json({success: false, msg: 'USER_DISABLED'});
      }

      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          email: user.email,
          username: user.username,
          token: tokenObject.token,
          expiresIn: tokenObject.expires
        });
      } else {
        res.status(401).json({success: false, msg: 'INVALID_PASSWORD'});
      }
    })
})

//Register a new user
userRoute.post('/register', function (req, res, next) {
  const saltHash = utils.genPassword(req.body._password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const newUser = new User({
    email: req.body._email,
    hash: hash,
    salt: salt,
    role: req.body._role,
    username: req.body._username,
    activated: req.body._activated,
    uuid: req.body._uuid,
    discount: req.body._discount,
    companyNip: req.body._companyNip,
    mainAddressId: '',
    addressToSendId: '',
    activationLink: req.body._activationLink,
    created: req.body._created,
    lastUpdate: req.body._lastUpdate
  });

  try {
    newUser.save().then(user => {

      const id = user._id;

      res.json({
        success: true, user: user,
        // token: jwt.token, expiresIn: jwt.expires});
      });

      sendActivationMail(user).catch(console.error);

      // TODO Pytanie czy to już tutaj potrzebne, czy dopiero po zalogowaniu???
      // const jwt = utils.issueJWT(user);
    });
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

userRoute.route('/send-mail').put(((req, res, next) => {
  console.log(req.params);
  if (req.params.email) {
    const user = {
      email: req.params.email
    }
    sendActivationMail(user).catch(console.error);
    console.log('Successfully send mail to ' + user.email);
  }
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

async function sendActivationMail(user) {
  const transporter = smtpConfig.transporter;
  const mailConfig = nodemailer.createTransport(transporter);
  const dataToSend = {
    from: '"Fred Foo 👻"' + transporter.auth.user, // sender address
    to: user.email, // list of receivers with comas in one string "okpol@okpol.pl, zamowienia@okpol.pl, " + user.email,
    subject: "Aktywacja konta ✔", // Subject line
    text: `Aktywuj konto klikając w poniższy link <br>" +
      "<a href=${user.activationLink}>Link aktywacyjny</a>`, // plain text body
    html: 'Aktywuj konto klikając w poniższy link <br>' +
      '<a href="' + user.activationLink + '">Link aktywacyjny</a>'
  };
  let info = await mailConfig.sendMail(dataToSend).then(() => console.log(`Mail send too ${user.email}`));

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = userRoute;
