const mongoose = require('mongoose');
const Assignment = require('../../models/assignment');
const Student = require('../../models/student');

const validateStudentList = function(students, userId){
  //must be an array
  if(!Array.isArray(students)){
    const err = new Error('The `students` must be in an array');
    err.status = 400;
    return Promise.reject(err);
  }
  if(students){
    let isValid = true;
    students.forEach(student => {
      //search each student for a valid id
      if(!mongoose.Types.ObjectId.isValid(student)){
        isValid = false;
      }
    });
    if(!isValid){
      //if we find one that is invalid, let them know
      const err = new Error('The `studentId` is not valid');
      err.status=400;
      return Promise.reject(err);
    }
  }
  return Student.find({$and: [{_id: {$in: students}, userId}]})
    .then(results => {
      //find all the students that are in this array and match the userId
      if(students.length !== results.length){
        const err = new Error('The `students` array contains an invalid id');
        err.status=400;
        return Promise.reject(err);
      }
    });
};
const validateAssignmentList = function(assignments, userId){
  if(!Array.isArray(assignments)){
    const err = new Error('The `assignments` must be in an array');
    err.status = 400;
    return Promise.reject(err);
  }
  if(assignments){
    let isValid = true;
    assignments.forEach(assignment => {
      if(!mongoose.Types.ObjectId.isValid(assignment)){
        isValid = false;
      }
    });
    if(!isValid){
      const err = new Error('The `assignmentId` is not valid');
      err.status=400;
      return Promise.reject(err);
    }
  }
  return Assignment.find({$and: [{_id: {$in: assignments}, userId}]})
    .then(results => {
      if(assignments.length !== results.length){
        const err = new Error('The `assignments` array contains an invalid id');
        err.status=400;
        return Promise.reject(err);
      }
    });
};

module.exports = {
  validateStudentList,
  validateAssignmentList
};