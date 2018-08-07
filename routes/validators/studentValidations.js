const mongoose = require('mongoose');
const Grade = require('../../models/student');
const Class = require('../../models/class');
const User = require('../../models/user');

const validateTeacherList = function(teachers, userId){
  if(!Array.isArray(teachers)){
    const err = new Error('The `teachers` must be in an array');
    err.status = 400;
    return Promise.reject(err);
  }
  if(teachers){
    let isValid = true;
    teachers.forEach(teacher => {
      if(!mongoose.Types.ObjectId.isValid(teacher)){
        isValid = false;
      }
    });
    if(!isValid){
      const err = new Error('The teacher id is not valid');
      err.status = 400;
      return Promise.reject(err);
    }
  }
  return User.find({$and: [{_id: {$in: teachers}, userId}]})
    .then(results => {
      if(teachers.length !== results.length){
        const err = new Error('The `teachers` array contains an invalid id');
        err.status=400;
        return Promise.reject(err);
      }
    });
};

const validateGradeList = function(grades, userId){
  if(!Array.isArray(grades)){
    const err = new Error('The `grades` must be in an array');
    err.status = 400;
    return Promise.reject(err);
  }
  if(grades){
    let isValid = true;
    grades.forEach(grade => {
      if(!mongoose.Types.ObjectId.isValid(grade)){
        isValid = false;
      }
    });
    if(!isValid){
      const err = new Error('The `gradeId` is not valid');
      err.status=400;
      return Promise.reject(err);
    }
  }
  return Grade.find({$and: [{_id: {$in: grades}, userId}]})
    .then(results => {
      if(grades.length !== results.length){
        const err = new Error('The `grades` array contains an invalid id');
        err.status=400;
        return Promise.reject(err);
      }
    });
};

const validateClassList = function(classes, userId){
  if(!Array.isArray(classes)){
    const err = new Error('The `assignments` must be in an array');
    err.status = 400;
    return Promise.reject(err);
  }
  if(classes){
    let isValid = true;
    classes.forEach(classItem => {
      if(!mongoose.Types.ObjectId.isValid(classItem)){
        isValid = false;
      }
    });
    if(!isValid){
      const err = new Error('The classId` is not valid');
      err.status=400;
      return Promise.reject(err);
    }
  }
  return Class.find({$and: [{_id: {$in: classes}, userId}]})
    .then(results => {
      if(classes.length !== results.length){
        const err = new Error('The `classes` array contains an invalid id');
        err.status=400;
        return Promise.reject(err);
      }
    }); 
};

module.exports = {
  validateClassList,
  validateGradeList,
  validateTeacherList
};