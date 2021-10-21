const jwb = require('jsonwebtoken');
const { User } = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decodet = jwb.verify(token, 'RubyGarage');
    const user = await User.findOne({
      _id: decodet._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send('error: Please authenticate.');
  }
};
module.exports = {
  auth,
};
