const mongoose =require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  date: {type: Date, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  classId: {classId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true}}
});

assignmentSchema.index({name: 1, userId: 1},{unique:true});
assignmentSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});
  
module.exports = mongoose.model('Assignment', assignmentSchema);