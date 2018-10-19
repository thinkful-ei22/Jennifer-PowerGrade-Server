const express = require('express');
const User = require('../models/user');
const Class = require('../models/class');
const Student = require('../models/student');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');
const {validateClassList, validateTeacherList, validateGradeList} = require('./validators/studentValidations');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));

router.get('/', (req, res, next) => {
  const {searchTerm, classId} = req.query;


  let filter = {};

  if(searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [{ 'firstName': re }, { 'lastName': re }];
  }
  if(classId){
    filter.classId = classId;
  }
  return Student.find(filter)
    .populate('grades classId')
    .then(result => {
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
  return Student.findById(id)
    .then(result => {
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

router.post('/', (req, res, next) => {
  const {firstName, lastName} = req.body;
  const userId = req.user.id;
  const newStudent = {
    firstName,
    lastName,
    teachers:[userId],
    classes:[],
    grades: []
  };
  if(!newStudent.firstName){
    const err = new Error('Missing `firstName` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newStudent.lastName){
    const err = new Error('Missing `lastName` in request body');
    err.status = 400;
    return next(err);
  }
  Promise.all([validateClassList, validateGradeList, validateTeacherList])
    .then(() => Student.create(newStudent))
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
  const {firstName, lastName, teachers, classes, grades} = req.body;
  const userId = req.user.id;
  const updatedStudent = {
    firstName,
    lastName,
    teachers,
    classes,
    grades
  };
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if(!updatedStudent.firstName){
    const err = new Error('Missing `firstName` in request body');
    err.status = 400;
    return next(err);
  }
  if(!updatedStudent.lastName){
    const err = new Error('Missing `lastName` in request body');
    err.status = 400;
    return next(err);
  }
  Student.findOneAndUpdate({_id:id, teachers:[userId]}, updatedStudent, {new: true})
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

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  //remove student
  const removeStudent = Student.findOneAndRemove({_id:id, teachers:[userId]});
  //pull student from classes
  const updateClassess = Class.updateMany(
    {student: id},
    {$pull: {students:id}}
  );
  //pull student from users
  const updateUsers = User.update(
    {student: id},
    {$pull: {students:id}}
  );
  Promise.all([removeStudent, updateClassess, updateUsers])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;