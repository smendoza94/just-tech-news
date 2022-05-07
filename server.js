const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");

// express handlebars requirements
const path = require("path");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});

// cookies and sessions requirements
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  // this object gives the params for cookies
  secret: "Super secret secret", // this should be stored in .env
  cookie: {}, // to use cookies, declare "cookies: {},"
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

// handlebars template engine connect to express
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// cookies and session connect to session, cookies, and use db
app.use(session(sess));

// middleware to translate to use json data format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(routes);

// turn on connection to db and server

// leave the .sync({ force: false }) so it doesnt erase the data base
// on every start up of the server

// set .sync({ force: true }) to true the database connection must sync
// with the model definitions and associations. By forcing the sync method
// to true, we will make the tables re-create if there are any association changes.
sequelize
  .sync({ force: false }) // force: true = DROP TABLE IF EXISTS
  .then(() => {
    app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}...`));
  });
