const jwt = require('jsonwebtoken');

const generateToken = (user) => {
 const payLoad = {
  user: {
    id: user._id,
  },
  };
  return jwt.sign(payLoad,"Alumni", {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
