const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const { createError, notFound } = require('./middleware');
const user = require('./routes/user');
const people = require('./routes/people');

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use('/user', user);
app.use('/people', people);

app.use(createError);
app.use(notFound);

module.exports = app;
