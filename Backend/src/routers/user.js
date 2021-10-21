const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

//Create new user
router.post('/user', async (req, res) => {
  const data = req.body;
  const newUser = User(data);
  const token = await newUser.generateAuthToken();
  try {
    await newUser.save();
    res.status(201).send({ newUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//Login
router.post('/user/login', auth, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByParams(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send('error password or email');
  }
});

//Logout
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (tokenObj) => tokenObj.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
