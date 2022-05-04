// this file will contain all the user-facing routes such as "homepage" and "login"
const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("homepage"); // use .render for handlebars
});

module.exports = router;
