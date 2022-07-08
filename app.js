var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Sequelize = require('sequelize')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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


// import { Sequelize, Model, DataTypes } from 'sequelize'

// const express = require('express')
// const Sequelize = require('sequelize')
// const app = express()
// const port = 3000
// app.use(express.json());

const user = 'newuser'
const host = 'localhost'
const database = 'plantsdb'
const password = 'pa5w0rt'
const pg_port = '5432'

const sequelize = new Sequelize(database, user, password, {
  host,
  pg_port,
  dialect: 'postgres',
  logging: false
})

sequelize
.authenticate()
.then(() => {
console.log('Connection has been established successfully.');
})
.catch(err => {
console.error('Unable to connect to the database:', err);
});
// const User = sequelize.define('user', {
// firstName: {
// type: Sequelize.STRING,
// allowNull: false
// },
// lastName: {
// type: Sequelize.STRING
// // allowNull true
// }
// }, {
// //options
// });

// User.sync({ force: true }) // Now the `users` table in the database corresponds to the model definition
// app.get('/', (req, res) => res.json({ message: 'Hello World' }))
// app.post('/user', async (req, res) => {
// try {
// const newUser = new User(req.body)
// await newUser.save()
// res.json({ user: newUser }) // Returns the new user that is created in the database
// } catch(error) {
// console.error(error)
// }
// })
// app.get('/user/:userId', async (req, res) => {
// const userId = req.params.userId
// try {
// const user = await User.findAll({
// where: {
// id: userId
// }
// }
// )
// res.json({ user })
// } catch(error) {
// console.error(error)
// }
// })
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))