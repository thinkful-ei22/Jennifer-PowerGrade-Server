const mongoose =require('mongoose');

const gradeSchema = new mongoose.Schema({
  value:{type: Number},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true},
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
  assignmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true},
  classId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true}
});

gradeSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});
  
module.exports = mongoose.model('Grade', gradeSchema);
  