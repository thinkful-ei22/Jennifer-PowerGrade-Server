const mongoose =require('mongoose');

const classSchema = new mongoose.Schema({
  name: {type: String, required: true},
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

classSchema.index({name: 1, userId: 1}, {unique: true});

classSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});

module.exports = mongoose.model('Class', classSchema);