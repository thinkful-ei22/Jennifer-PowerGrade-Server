const mongoose =require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName:{type: String, required:true},
  lastName: {type: String, required:true},
  // teachers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', unique:true}],
  classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
  grades: [{type: mongoose.Schema.Types.ObjectId, ref: 'Grade', unique:true}]
});

studentSchema.index({firstName: 1, lastName: 1}, {unique: true});

studentSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});
  
module.exports = mongoose.model('Student', studentSchema);