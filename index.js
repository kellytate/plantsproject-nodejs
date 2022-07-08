// // import { Sequelize, Model, DataTypes } from 'sequelize'

// const express = require('express')
// const Sequelize = require('sequelize')
// const app = express()
// const port = 3000
// app.use(express.json());

// const user = 'newuser'
// const host = 'localhost'
// const database = 'plantsdb'
// const password = 'pa5w0rt'
// const pg_port = '5432'

// const sequelize = new Sequelize(database, user, password, {
//   host,
//   pg_port,
//   dialect: 'postgres',
//   logging: false
// })

// sequelize
// .authenticate()
// .then(() => {
// console.log('Connection has been established successfully.');
// })
// .catch(err => {
// console.error('Unable to connect to the database:', err);
// });
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