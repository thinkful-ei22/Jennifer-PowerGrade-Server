const mongoose = require('mongoose');
const Assignment = require('../../models/assignment');
const Grade = require('../../models/grade');
const Student = require('../../models/student');
const Class = require('../../models/class');
const Category = require('../../models/category');

const validateAssignmentId = function(assignmentId, userId){
//check if the assignmentId is mongoose approved
  if(!mongoose.Types.ObjectId.isValid(assignmentId)){
    const err = new Error('The `assignmnetId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  //make sure it is owned by the current user
  return Assignment.count({_id: assignmentId, userId})
    .then(count => {
      if (count === 0) {
        const err = new Error('The `assignmentId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
};
const validateStudentId = function(studentId, userId){
  //check if the categoryId is mongoose approved
  if(!mongoose.Types.ObjectId.isValid(studentId)){
    const err = new Error('The `assignmnetId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  return Student.count({_id: studentId, userId})
    .then(count => {
      if (count === 0) {
        const err = new Error('The `studentId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
};

const validateClassId = function(classId, userId){
  //check if the categoryId is mongoose approved
  if(!mongoose.Types.ObjectId.isValid(classId)){
    const err = new Error('The `assignmnetId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  return Class.count({_id: classId, userId})
    .then(count => {
      if (count === 0) {
        const err = new Error('The `classId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
};

module.exports = {
  validateAssignmentId,
  validateStudentId,
  validateClassId
};