const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.post('/', (req, res, next)=>{
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
    
  if(missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  //validate that all inputs are strings
  const stringFields = ['firstName','lastName', 'username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
    
  if(nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  //validate that there is no beginning or ending whitespace in UN or PW
  
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );
  
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }
  
  //validate the correct length of UN and PW
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
              req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
  );
  
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
  let {firstName, lastName, username, password} = req.body;
  firstName = firstName.trim();
  lastName= lastName.trim();
  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(digest => {
      return User.create({
        username,
        password: digest,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).location(`/api/users/${user.id}`).json(user.apiReport());//returned user will not display the PW
    })
    .catch(err => {
      if(err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      next(err);
    });
});
  
module.exports = router;