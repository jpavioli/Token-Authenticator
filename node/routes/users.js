// Express router for suscinct requests
const express = require('express');
const router = express.Router();

// Required node modlues for authentication
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

// Required DB connections
const Auth = require('../models/Auth');
const User = require('../models/Users');

// Middleware for authenticating logged in users
const auth = require('../middleware/auth');

// POST users/signup
// - Validate email and password
// - Validate email is unique against users
// - Create a new DB entry for
//    - User Details using customerId as primaryKey
//    - Autentication linking email and salted / hashed password to customerId
// - Return JWT token for authentcated user
//
// Sample Request:
// curl --location 'http://localhost:${port}/users/signup' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "email": "john.doe@gmail.com",
//     "password": "shhh",
//     "firstName": "John",
//     "lastName": "Doe",
//     "birthday": "01/06/1988",
//     "city": "New York",
//     "state": "NY",
//     "zip": "10029"
// }'
//
// Sample Response:
// {
//     "token": "<TOKEN>",
//     "success": true
// }

router.post('/signup', async (req, res) => {

  const { email, password } = req.body;

  // Simple validation
  if(!email || !password) {
    return res.status(400).json({
      message: 'Please enter an Email and Password',
      success: false
    });
  }

  // Check for existing user
  let user = await Auth.findOne({ where: {email: email} });

  if(!user) {
    // Create a new User
    user = req.body;
    // Salt and Encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        if(err) throw err;
        // create an Auth Entry
        let newAuth = await new Auth({
          customerId: uuid.v4(),
          email:      user.email,
          password:   hash
        });
        newAuth.save();
        // create a User Entry
        let newUser = await new User({
          customerId: newAuth.customerId,
          firstName:  user.firstName,
          lastName:   user.lastName,
          birthday:   user.birthday,
          city:       user.city,
          state:      user.state,
          zip:        user.zip
        })
        newUser.save();

        // Sign and respond with JWT Token
        jwt.sign(
          { customerId: newUser.customerId },
          config.get('jwtSecret'),
          { expiresIn: 3600 },
          (err, token) => {
            if(err) throw err;
            res.status(200).json({
              token,
              success: true
            });
          }
        )
      })
    });
  } else {
    // User Already Exists
    return res.status(400).json({
      message: 'User Already Exists!',
      success: false
    })
  }

});

// GET /signin
// - Validate email and password are included in request
// - Validate email exists
// - Authenticate email and salted / hashed password
// - Return JWT token for authentcated user
//
// Sample Request:
// curl --location --request GET 'http://localhost:6969/users/signin' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "email": "john.doe@gmail.com",
//     "password": "shhh"
// }'
//
// Sample Response:
// {
//     "token": "<TOKEN>",
//     "success": true
// }

router.get('/signin', async (req, res) => {

  const { email, password } = req.body;

  // Simple validation
  if(!email || !password) {
    return res.status(400).json({
      message:'Please enter an Email and Password',
      success:false
    });
  };

  // Check for existing user
  const user = await Auth.findOne({raw:true, where: {email} });

  if(!user){
     return res.status(400).json({
       message:'User Does not exist',
       success:false
     });
  } else {
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({
      message: 'Invalid credentials',
      success:false}
    );

    // Sign and respond with JWT Token
    jwt.sign(
      { customerId: user.customerId },
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if(err) throw err;
        res.status(200).json({
          token,
          success: true
        });
      }
    )
  }
});

// GET user/
// - Authenticate JWT
// - Find authentcated user
// - Return the authenticated user
//
// Sample Request:
// curl --location --request PATCH 'http://localhost:6969/users/' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Bearer <TOKEN>' \
//
// Sample Response:
// {
//     "user": {
//         "customerId": "70ed9854-d215-4bd4-96d9-368b18a486c3",
//         "firstName": "John",
//         "lastName": "Doe",
//         "birthday": "01/06/1988",
//         "city": "New York",
//         "state": "NY",
//         "zip": 10029,
//         "createdAt": "2023-11-01 00:03:30.960 +00:00",
//         "updatedAt": "2023-11-01 00:03:30.960 +00:00"
//     },
//     "success": false
// }

router.get('/', auth, async (req, res) => {
  let user = await User.findOne({
    where: {customerId: req.user.customerId},
    raw: true
  })
  if (user){
    return res.status(200).json({
      user,
      success:true
    });
  } else {
    return res.status(401).json({
      message: "User not Found",
      success: false
    })
  }
});

// PATCH user/
// - Validate email and password are included in request
// - Validate email exists
// - Authenticate email and salted / hashed password
// - Return JWT token for authentcated user
//
// Sample Request:
// curl --location --request PATCH 'http://localhost:6969/users/' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Bearer <TOKEN>' \
// --data '{
//     "firstName": "Not John"
// }'
//
// Sample Response:
// {
//     "user": {
//         "customerId": "70ed9854-d215-4bd4-96d9-368b18a486c3",
//         "firstName": "Not John",
//         "lastName": "Doe",
//         "birthday": "01/06/1988",
//         "city": "New York",
//         "state": "NY",
//         "zip": 10029,
//         "createdAt": "2023-11-01 00:03:30.960 +00:00",
//         "updatedAt": "2023-11-01 00:03:30.960 +00:00"
//     },
//     "success": false
// }

router.put('/', auth, async (req, res) => {
  let user = await User.findOne({
    where: {customerId: req.user.customerId},
    raw: true
  })
  user = {
    ...user,
    ...req.body
  };
  delete user["createdAt"];
  delete user["updatedAt"];
  let response = await User.update(
    { ...user},
    {
      where:{customerId:user.customerId}
    }
  );
  if (user){
    return res.status(200).json({
      user,
      success:true
    });
  } else {
    return res.status(404).json({
      message: "User not Found",
      success: false
    })
  }
});

// export router modules
module.exports = router;
