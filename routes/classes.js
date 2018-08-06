const express = require('express');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const Class = require('../models/class');
const Student = require('../models/student');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  //TODO add a search fiter and a class filter
  return Class.find()
    // .populate('userId students')
    .then(result => {
      console.log(result);
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

    
module.exports = router;