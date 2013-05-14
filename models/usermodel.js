var mongoose = require('mongoose'),
UserSchema = mongoose.Schema({
  displayName: String,
  email: String,
  name: {
    familyName: String,
    givenName: String
  },
  logins: {type: Number, default: 0},
  avatar:String
});

UserSchema.statics.findByEmail = function (email, callback) {

	UserModel.findOne({email:email}, callback);

};

UserSchema.methods.fullname = function () {

	return this.name.givenName + ' ' + this.name.familyName;

};

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;