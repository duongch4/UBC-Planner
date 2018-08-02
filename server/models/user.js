const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// define the User model schema
const UserSchema = new mongoose.Schema({
  info: {
    email: String,
    password: String,
    name: String,
    sid: Number,
    bm: String,
    cohort: Number,
    //isVerified: Boolean
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  courses: Object,
  remarks: Object
}, { collection: 'students' });

// TODO: email verification
/*
const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});*/

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  console.log('compare password', password, this.info.password);
  // console.log('compare password');
  // return bcrypt.compare(password.toString(), this.info.password.toString(), callback);
    if (password === this.info.password) {
        callback(null, true);
    } else {
        callback('Incorrect password', false);
    }

};


/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;
  console.log(this.info);
  console.log(this.info.password);

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.info.password = hash;

      return next();
    });
  });
});


module.exports = mongoose.model('User', UserSchema);
