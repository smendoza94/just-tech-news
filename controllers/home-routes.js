// this file will contain all the user-facing routes such as "homepage" and "login"
const router = require("express").Router();

router.get("/", (req, res) => {
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

module.exports = router;
