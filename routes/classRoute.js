const express = require('express');
const Class = require('../models/class');
const Student = require('../models/student');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const {validateStudentList, validateAssignmentList} = require('./validators/classValidation');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));
//get list of classes
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  let filter = {userId};

  return Class.find(filter)
    .populate('userId students assignments')
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
//get one class
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return Class.findById(id)
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
//create a new class
router.post('/', (req, res, next) => {
  const {name, students} = req.body;
  const userId = req.user.id;
  const newClass = {
    name,
    userId,
    students
  };
  if(!newClass.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newClass.students){
    const err = new Error('Please add `students` to request body');
    err.status = 400;
    return next(err);
  }
  if(!newClass.assignments){
    newClass.assignments=[];
  }
  let createdClass;

  return Class.create(newClass)
    .then(result =>{
      createdClass = result;
      return Student.update({_id: {$in: req.body.students}}, {$push: {classes: createdClass}});
    })
    .then(() => {
      res
        .location(`${req.originalUrl}/${createdClass.id}`)
        .status(201)
        .json(createdClass);
    })
    .catch(err => {
      next(err);
    });
});
//update a class
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name, students, assignments} = req.body;
  const userId = req.user.id;
  const updatedClass = {
    name,
    students,
    assignments,
    userId
  };
  //validate id
  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if(!updatedClass.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  Class.findOneAndUpdate({_id:id, userId}, updatedClass, {new: true})
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
//delete a class
router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  const removeClass = Class.findOneAndRemove({_id: id, userId});
  const updateUsers = User.update(
    {classes: id},
    {$pull: {classes:id}}
  );
  const updateStudents = Student.update(
    {students: id},
    {$pull: {students:id}}
  );
  Promise.all([removeClass, updateUsers, updateStudents])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;