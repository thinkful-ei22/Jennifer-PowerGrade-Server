const express = require('express');
const Grade = require('../models/grade');
const router = express.Router();
const passport = require('passport');
const {validateAssignmentId, validateStudentId, validateClassId} = require('./validators/gradeValidation');
const mongoose = require('mongoose');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));

router.get('/', (req, res, next) => {
  const {classId} = req.query;
  const userId = req.user.id;
  let filter = {userId};

  if(classId){
    filter.classId = classId;
  }
  return Grade.find(filter)
    .then(results => {
      if(results){
        res.json(results);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    }); 
});

router.post('/', (req, res, next) => {
  const {value, studentId, assignmentId, classId} = req.body;
  const userId = req.user.id;
  const newGrade = {
    value,
    studentId,
    assignmentId,
    classId,
    userId
  };
  if(!value){
    const err = new Error('Missing `value` in request body');
    err.status = 400;
    return next(err);
  }
  Promise.all([
    validateAssignmentId(assignmentId, userId),
    validateStudentId(studentId, userId),
    validateClassId(classId, userId)
  ])
    .then(()=>Grade.create(newGrade))
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;