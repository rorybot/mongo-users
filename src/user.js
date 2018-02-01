const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const UserSchema = new Schema({
  name: String
})

const User = mongoose.model('user', UserSchema);

module.exports = User;
