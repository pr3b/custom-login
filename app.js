if (!process.env.JWT_SECRET) {
  throw new Error('You must set JWT_SECRET as an environment variable');
}

if (!process.env.HUB_URL) {
  throw new Error('You must set HUB_URL as an environment variable');
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const readmeLogin = require('./readme-login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); // Set view engine to use HTML templates

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'views', 'index.html')); // Send HTML file directly
});

app.post('/', readmeLogin);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'views', 'error.html')); // Send error HTML file
});

module.exports = app;
