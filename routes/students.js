const express = require('express');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const Class = require('../models/class');
const Student = require('../models/student');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  //TODO add a search fiter and a class filter
  return Student.find()
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

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  //TODO add a search fiter and a class filter
  return Student.findById(id)
    // .populate('userId classId')
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