let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  dbConfig = require('./database/db');
require('dotenv').config();
const passport = require('passport');

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database successfully connected')
  },
  error => {
    console.log('Database could not connected: ' + error)
  }
)
const app = express();
require('./config/passport')(passport);
app.use(passport.initialize(undefined));

// Setting up port with express js
const userRoute = require('../backend/routes/user.route');
const singleConfigurationRoute = require('../backend/routes/singleConfiguration.route');
const addressRoute = require("./routes/address.route");
const cartRoute = require("./routes/cart.route");
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/window-configurator-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/window-configurator-crud-app')));
app.use('/api', singleConfigurationRoute);
app.use('/api/users', userRoute);
app.use('/api/addresses', addressRoute);
app.use('/api/carts', cartRoute);
// routes.initialize(app);

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
