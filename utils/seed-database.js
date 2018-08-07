const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Assignment = require('../models/assignment');
const seedAssignments = require('../database/seed/assignments');
const Class = require('../models/class');
const seedClasses = require('../database/seed/classes');
const Student = require('../models/student');
const seedStudents = require('../database/seed/students');
const User = require('../models/user');
const seedUsers = require('../database/seed/users');
const Grade = require('../models/grade');
const seedGrades = require('../database/seed/grades');
const Category = require('../models/category');
const seedCategories = require('../database/seed/categories');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Assignment.insertMany(seedAssignments),
      Assignment.createIndexes(),
      Class.insertMany(seedClasses),
      Class.createIndexes(),
      Student.insertMany(seedStudents),
      Student.createIndexes(),
      User.insertMany(seedUsers),
      User.createIndexes(),
      Grade.insertMany(seedGrades),
      Grade.createIndexes(),
      Category.insertMany(seedCategories),
      Category.createIndexes()
    ])
      .then(results => {
        console.info(`Inserted ${results[0].length} Assignments`);
        console.info(`Inserted ${results[2].length} Classes`); 
        console.info(`Inserted ${results[4].length} Students`);
        console.info(`Inserted ${results[6].length} Users`);  
        console.info(`Inserted ${results[8].length} Grades`); 
        console.info(`Inserted ${results[10].length} Categories`);  
      })
      .then(() => mongoose.disconnect())
      .catch(err => {
        console.error(err);
      });
  });