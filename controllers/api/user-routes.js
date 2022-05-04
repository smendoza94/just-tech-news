const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users, display
router.get('/', (req, res) => {
  User.findAll({ // access User Model and use .findAll() method "SELECT * FROM users;"
    attributes: { exclude: ['password'] } // hides passwords from get requests
  }) 
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err); 
      res.status(500).json(err);
    })
});

// GET /api/users/1, display a single user 
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password']},  // hides passwords from get requests
    where: {id: req.params.id},
    include: [
      {
        model: Post,
        attributes: ['id','title','post_url','created_at']
      },
      {
        model: Comment,
        attributes: ['id','comment_text','created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id'});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// POST /api/users, create a new user
router.post('/', (req, res) => {
  // expects {username: 'Steve', email: 'steve@gmail.com', password: 'password'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// login post and validation /api/user/login
router.post('/login', (req, res) => {
  // expects {email: 'steve@gmail.com, password: 'password'}
  User.findOne({
    where: { email: req.body.email }
  })
  .then(dbUserData => {
    if (!dbUserData){
      res.status(400).json({ message: 'No user with that email address'});
      return;
    }
    // commented response so that data doesnt get displayed when logging in
    // res.json({user: dbUserData});
    // verify password
    const validPassword = dbUserData.checkPassword(req.body.password); // returns boolean after syncCompare()
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }
    res.json({ user: dbUserData, message: 'You are now logged in' });
  })
})

// PUT /api/user/1, update a single user
router.put('/:id', (req, res) => {
  // expects {username: 'Steve', email: 'steve@gmail.com', password: 'password'}
  
  // if req.body has exact key/value pairs to match the model,
  // you can just use `req.body` instead
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id }
  })
  .then(dbUserData => {
    if (!dbUserData[0]) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// DELETE /api/user/1, remove a single user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: { id: req.params.id }
  })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;