var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const mongoose = require('mongoose');
const passport = require('passport');

var getRouter = require('./routes/gets');
var postRouter = require('./routes/posts');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', getRouter);
app.use('/', postRouter);

if (process.env.NODE_ENV === 'development') {
    var corsOptions = {
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200
    };
      app.use(cors(corsOptions));
}

// MongoDB setup -----------------------------------------------------------
// const mongoDB = 'mongodb://127.0.0.1:27017/testdb';
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB)
        .then(() => console.log("MongoDB is connected!"))
        .catch((error) => console.log(`Error has occured: ${error}`));
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error!!!"));
// -------------------------------------------------------------------------¨

module.exports = app;