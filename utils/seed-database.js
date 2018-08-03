const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const User = require('../models/user');
const Assignment = require('../models/assignment');
const Class = require('../models/class');
const Grade = require('../models/grade');
const Student = require('../models/student');
const seedUsers = require('../db/seed/users');
const seedAssignments = require('../db/seed/assignments');
const seedClasses = require('../db/seed/classes');
const seedStudents = require('../db/seed/students');
const seedGrades = require('../db/seed/grades');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      
      User.insertMany(seedUsers),
      User.createIndexes(),
      
      Assignment.insertMany(seedAssignments),
      Assignment.createIndexes(),

      Class.insertMany(seedClasses),
      Class.createIndexes(),

      Student.insertMany(seedStudents),
      Student.createIndexes(),

      Grade.insertMany(seedGrades),
      Grade.createIndexes()
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
