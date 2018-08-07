const mongoose = require('mongoose');
const Grade = require('../../models/student');
const Class = require('../../models/class');
const Category = require('../../models/category');
//check that the class id is valid
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
//check that the category id is valid
const validateCategoryId = function(categoryId, userId){
  //check if the categoryId is mongoose approved
  if(!mongoose.Types.ObjectId.isValid(categoryId)){
    const err = new Error('The `categoryId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }
  return Category.count({_id: categoryId, userId})
    .then(count => {
      if (count === 0) {
        const err = new Error('The `categoryId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
};
//check that the grades are all valid
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

module.exports = {
  validateCategoryId,
  validateClassList,
  validateGradeList
};