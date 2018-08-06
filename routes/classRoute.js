const express = require('express');
const Class = require('../models/class');
const router = express.Router();
const passport = require('passport');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));
//get list of classes
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
//get one class
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  //TODO add a search fiter and a class filter
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
  const {name, students, assignments} = req.body;
  const userId = req.user.id;
  const newClass = {
    name,
    students,
    assignments,
    userId
  };
  if(!newClass.name){
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  if(!newClass.students){
    newClass.students=[];
  }
  if(!newClass.assignments){
    newClass.assignments=[];
  }
  //add studentId and assignmentId validations
  Class.create(newClass)
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