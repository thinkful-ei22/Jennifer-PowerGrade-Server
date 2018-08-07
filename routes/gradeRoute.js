const express = require('express');
const Grade = require('../models/grade');
const router = express.Router();
const passport = require('passport');
const {validateAssignmentId, validateStudentId, validateClassId} = require('./validators/gradeValidation');
const mongoose = require('mongoose');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));

router.get('/', (req, res, next) => {
  const {classId, studentId, assignmentId} = req.query;
  const userId = req.user.id;
  
  let filter = {userId};

  if(classId){
    filter.classId = classId;
  }
  if(studentId){
    filter.studentId = studentId;
  }
  if(assignmentId){
    filter.assignmentId = assignmentId;
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

router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {value, studentId, assignmentId, classId} = req.body;
  const userId = req.user.id;
  const updatedGrade = {
    value,
    studentId,
    assignmentId,
    classId,
    userId
  };
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if(!updatedGrade.value){
    const err= new Error('Missing `value` in request body');
    return next(err);
  }
  Grade.findOneAndUpdate({_id:id, userId}, updatedGrade, {new: true})
    .then(result => {
      if(result){
        res
          .json(result)
          .status(200);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;