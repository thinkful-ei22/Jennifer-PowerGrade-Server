const express = require('express');
const Grade = require('../models/grade');
const Assignment = require('../models/assignment');
const Student = require('../models/student');
const router = express.Router();
const passport = require('passport');
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
  return Grade.find()
    .populate('studentId assignmentId')
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


router.put('/', (req, res, next) => {
  const {id, value, studentId, assignmentId} = req.body;
  const userId = req.user.id;
  const updatedGrade = {
    value,
    studentId,
    assignmentId,
    userId
  };
  if(!updatedGrade.value){
    const err= new Error('Missing `value` in request body');
    return next(err);
  }
  let editedGrade;

  Grade.findOneAndUpdate({_id:id || mongoose.Types.ObjectId() , userId}, updatedGrade, {upsert: true, new: true, setDefaultsOnInsert: true})
    .then(result => {
      editedGrade = result;
      return Assignment.update({_id: {$eq: req.body.assignmentId}}, {$push: {grades: editedGrade}});
    })
    .then(() => {
      return Student.update({_id: {$eq: req.body.studentId}}, {$push: {grades: editedGrade}});
    })
    .then((result) => {
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