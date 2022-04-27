const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users, display
router.get('/', (req, res) => {
  User.findAll() // access User Model and use .findAll() method "SELECT * FROM users;"
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err); 
      res.status(500).json(err);
    })
});

// GET /api/users/1, display a single user 
router.get('/:id', (req, res) => {
  User.findOne({
    where: {id: req.params.id}
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

// PUT /api/user/1, update a single user
router.put('/:id', (req, res) => {
  // expects {username: 'Steve', email: 'steve@gmail.com', password: 'password'}
  
  // if req.body has exact key/value pairs to match the model,
  // you can just use `req.body` instead
  User.update(req.body, {
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