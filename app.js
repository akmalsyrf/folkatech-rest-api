var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    //   useFindAndModify: true,
    //   useCreateIndex: true,
});

mongoose.connection;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
const authRouter = require("./app/usecase/auth/router")
const userRouter = require("./app/usecase/user/router")

const baseURL = '/api/v1'
app.use(indexRouter);
app.use(baseURL, authRouter)
app.use(baseURL, userRouter)

// catch 404 and forward to error handler
app.use((_, res) => res.sendStatus(404))

module.exports = app;
