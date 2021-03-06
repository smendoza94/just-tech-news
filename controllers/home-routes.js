// this file will contain all the user-facing routes such as "homepage" and "login"
const router = require("express").Router();

const sequelize = require("../config/connection"); // used to count votes in PUT votes
const { Post, Comment, User, Vote } = require("../models");

// homepage route request /
router.get("/", (req, res) => {
  console.log(req.session);
  // // use .render for handlebars
  // res.render("homepage", {
  //   id: 1,
  //   post_url: "https://handlebarsjs.com/guide/",
  //   title: "Handlebars Docs",
  //   created_at: new Date(),
  //   vote_count: 10,
  //   comments: [{}, {}],
  //   user: {
  //     username: "text_user",
  //   },
  // });
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // res.json(dbPostData);
      // pass a single post object into the homepage template
      // console.log(dbPostData[0]); // see how sequelize formats the data

      // This will loop over and map each Sequelize object into a serialized version of itself,
      // saving the results in a new posts array.
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn, // pass this var to views to hide sections
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
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

// access a single post /post/:id
router.get("/post/:id", (req, res) => {
  // // hardcode data to test the route
  // const post = {
  //   id: 1,
  //   post_url: "https://handlebarsjs.com/guide/",
  //   title: "Handlebars Docs",
  //   vote_count: 10,
  //   comment: {
  //     username: "test-user",
  //   },
  // };
  Post.findOne({
    where: { id: req.params.id },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      //serialize the data
      const post = dbPostData.get({ plain: true });
      //pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
