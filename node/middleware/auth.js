const config = require('config');
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
  // Extract token from request
  const token = req.header('authorization').split(" ")[1];
  // Check for token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorizaton denied' });

  try {
    // Verify token
    const decoded = await jwt.verify(token, config.get('jwtSecret'));
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
