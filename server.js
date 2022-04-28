const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware to translate to use json data format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server

// leave the .sync({ force: false }) so it doesnt erase the data base
// on every start up of the server

// set .sync({ force: true }) to true the database connection must sync 
// with the model definitions and associations. By forcing the sync method 
// to true, we will make the tables re-create if there are any association changes.
sequelize.sync({ force: false }) // force: true = DROP TABLE IF EXISTS
  .then(() => {
    app.listen(PORT, () => console.log('Now listening...'));
  });