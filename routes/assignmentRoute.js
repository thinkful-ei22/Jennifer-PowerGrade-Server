const express = require('express');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const Class = require('../models/class');
const Grade = require('../models/grade');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');
const {validateCategoryId, validateClassList, validateGradeList} = require('./validators/assignmentValidation');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));

router.get('/', (req, res, next) => {
  const {searchTerm, classId} = req.query;
  const userId = req.user.id;

  let filter = {userId};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter = { 'name': re };
  }
  if(classId){
    filter.classId = classId;
  }

  return Assignment.find(filter)
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
  return Assignment.findById(id)
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
  const {name, date, classes, categoryId} = req.body;
  const userId = req.user.id;
  const newAssignment = {
    name,
    date,
    userId,
    classes,
    categoryId,
  };
  if(!newAssignment.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newAssignment.date){
    const err = new Error('Missing `date` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newAssignment.categoryId){
    const err = new Error('Missing `categoryId` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newAssignment.classes){
    newAssignment.classes = [];
  }
  if(!newAssignment.grades){
    newAssignment.grades = [];
  }
  let createdAssignment;

  Promise.all([validateCategoryId, validateClassList, validateGradeList])
    .then(() => Assignment.create(newAssignment))
    .then(result => {
      createdAssignment = result;
      return Class.update({_id: {$in: req.body.classes}}, {$push: {assignments: createdAssignment}}, {multi:true});
    })
    .then(() => {
      res
        .location(`${req.originalUrl}/${createdAssignment.id}`)
        .status(201)
        .json(createdAssignment);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name, classes, categoryId, date, grades} = req.body;
  const userId = req.user.id;
  const updatedAssignment = {
    name,
    date,
    userId,
    classes,
    categoryId,
    grades
  };
  //validate id
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if(!updatedAssignment.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if(!updatedAssignment.date){
    const err = new Error('Missing `date` in request body');
    err.status = 400;
    return next(err);
  }
  if(!updatedAssignment.categoryId){
    const err = new Error('Missing `categoryId` in request body');
    err.status = 400;
    return next(err);
  }
  Assignment.findOneAndUpdate({_id:id, userId}, updatedAssignment, {new: true})
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
  const removeAssignment = Assignment.findOneAndRemove({_id: id, userId});

  //pull assignment from users
  const updateUsers = User.update(
    {assignment: id},
    {$pull: {assignments:id}}
  );
  //pull assignment from class
  const updateClassess = Class.updateMany(
    {assignment: id},
    {$pull: {assignments:id}}
  );
  //remove all grades related to assignment IS THIS RIGHT?
  const updateGrades = Grade.deleteMany(
    { assignments: id }
  );
  Promise.all([removeAssignment, updateUsers, updateGrades, updateClassess])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;