const mongoose =require('mongoose');

const gradeSchema = new mongoose.Schema({
  grade:{type: Number},
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}
});

gradeSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});
  
module.exports = mongoose.model('Grade', gradeSchema);
  