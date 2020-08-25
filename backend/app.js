require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportSession = require('passport-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const User = require('./models/user');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

mongoose.connect(process.env.MONGO_CONNECT, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

const scrapeRouter = require('./routes/scrape.js');
const offersRouter = require('./routes/offers.js');
const usersRouter = require('./routes/users.js');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'very difficult key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const whitelist = ['http://localhost:3000', 'http://localhost:5000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.post('/signup', async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const candidate = await User.findOne({ email });
  const passHash = await bcrypt.hash(password, 10);
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    return res.json({ message: 'Fill out all fields!' });
  } else if (candidate) {
    res.status(400);
    return res.json({ message: 'User with this email already exists!' });
  }
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: passHash,
  });
  newUser.save();
  console.log('User Registration successful');
  req.login(newUser, function (err) {
    if (err) { return next(err) }
    return res.json({ firstName, lastName, _id: newUser._id, favourites: [], startedProjects: [], finishedProjects: [] });
  });
});


app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  let match;
  if (user)
    match = await bcrypt.compare(password, user.password);
  if (!email || !password) {
    res.status(400);
    return res.json({ message: 'Fill out all fields!' });
  }
  else if (!user) {
    res.status(404);
    return res.json({ message: 'No user with this email. Please sign up.' });
  }
  else if (!match) {
    res.status(400);
    return res.json({ message: 'Wrong password!' });
  } else {
    req.login(user, function (err) {
      if (err) { return next(err) }
      const { firstName, lastName, _id, favourites, startedProjects, finishedProjects } = user;
      return res.json({ firstName, lastName, _id, favourites, startedProjects, finishedProjects });
    })
  }
});

app.post('/logout', authenticationMiddleware(), function (req, res) {
  req.logout();
  res.json({ message: 'logout succesful' });
})

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use('/scrape', scrapeRouter);
app.use('/offers', offersRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3003);