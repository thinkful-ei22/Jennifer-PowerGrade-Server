const mongoose =require('mongoose');

const categorySchema = new mongoose.Schema({
  name:{type: String, required:true},
  value: {type: Number, required:true}
});

categorySchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
  }
});
  
module.exports = mongoose.model('Category', categorySchema);