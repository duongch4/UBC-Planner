const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
var flash = require('express-flash');
var cors = require('cors');
const port = process.env.PORT || 5000;

// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();

// Serve any static files
 app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static('./server/static/'));
app.use(express.static('./client/build/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
const emailRoutes = require('./server/routes/email');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/email', emailRoutes);
app.use(cors());

app.use(flash());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


// start the server
app.listen(port, () => console.log(`Listening on port ${port}`));
