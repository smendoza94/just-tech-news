// this file will contain all the user-facing routes such as "homepage" and "login"
const router = require("express").Router();

// homepage route request /
router.get("/", (req, res) => {
  console.log(req.session);
  // use .render for handlebars
  res.render("homepage", {
    id: 1,
    post_url: "https://handlebarsjs.com/guide/",
    title: "Handlebars Docs",
    created_at: new Date(),
    vote_count: 10,
    comments: [{}, {}],
    user: {
      username: "text_user",
    },
  });
});

// login page /login
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

module.exports = router;
