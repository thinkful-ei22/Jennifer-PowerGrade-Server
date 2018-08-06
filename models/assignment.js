const mongoose =require('mongoose');

const assignmentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  date: {type: String, required: true}, //TODO what does a Date datatype look like for seed data?
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  classId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true}],
  categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  grades: [{type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true}]
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