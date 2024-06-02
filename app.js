var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { Client } = require('@notionhq/client');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Initializing Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = 'e888b17e4f134aa2bfd5adec0157bead'; // Replace with your database ID

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Notion API data fetch route
app.get('/data', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    // res.json(response);
    res.render('data', { data: response });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch data from Notion');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
