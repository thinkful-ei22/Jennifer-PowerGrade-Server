const mongoose =require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  username: {type: String, required: true},
  password: {type: String, required: true}  
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (document, ret) => {
    delete ret._id;
    delete ret.password;
  }
});

userSchema.methods.apiReport = function(){
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
  
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};
  
module.exports = mongoose.model('User', userSchema);