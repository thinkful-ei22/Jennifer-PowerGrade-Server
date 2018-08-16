const express = require('express');
const Grade = require('../models/grade');
const Assignment = require('../models/assignment');
const Student = require('../models/student');
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
    .populate('studentId assignmentId classId')
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
  let createdGrade;
  Promise.all([
    validateAssignmentId(assignmentId, userId),
    validateStudentId(studentId, userId),
    validateClassId(classId, userId)
  ])
    .then(
      ()=>Grade.create(newGrade))
    .then(result => {
      createdGrade = result;
      return Student.update({_id: {$in: req.body.studentId}}, {$push: {grades: createdGrade}});
    })
    .then(() => {
      return Assignment.update({_id: {$in: req.body.assignmentId}}, {$push: {grades: createdGrade}});
    })
    .then(()=> {
      res
        .location(`${req.originalUrl}/${createdGrade.id}`)
        .status(201)
        .json(createdGrade);
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
router.delete('/:id', (req, res, next) => { //will I even need this one?
  const {id} = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  const removeGrade = Grade.findOneAndRemove({_id: id, userId});
  const updateAssignments = Assignment.update(
    {grades: id},
    {$pull: {grades:id}}
  );
  const updateStudents = Student.update(
    {grades: id},
    {$pull: {grades:id}}
  );
  Promise.all([removeGrade, updateAssignments, updateStudents])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;