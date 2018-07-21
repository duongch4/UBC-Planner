const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CourseSchema = require('./course.js').schema;

const RemarksSchema = new mongoose.Schema({
	PADE: {
		type: String,
		default: ""
	},
	ENGL1XX: {
		type: String,
		default: ""
	},
	CPSC110: {
		type: String,
		default: ""
	},
	CPSC121: {
		type: String,
		default: ""
	},
	MATH180: {
		type: String,
		default: ""
	},
	STAT203: {
		type: String,
		default: ""
	},
	Communication: {
		type: String,
		default: ""
	},
	CPSC210: {
		type: String,
		default: ""
	},
	CPSC221: {
		type: String,
		default: ""
	},
	CPSC213: {
		type: String,
		default: ""
	},
	CPSC310: {
		type: String,
		default: ""
	},
	CPSC320: {
		type: String,
		default: ""
	},
	CPSC313: {
		type: String,
		default: ""
	},
	CPSC3X1: {
		type: String,
		default: ""
	},
	CPSC3X2: {
		type: String,
		default: ""
	},
	CPSC4X1: {
		type: String,
		default: ""
	},
	CPSC4X2: {
		type: String,
		default: ""
	},
	BM1: {
		type: String,
		default: ""
	},
	BM2: {
		type: String,
		default: ""
	},
	BM3: {
		type: String,
		default: ""
	},	
	BM4: {
		type: String,
		default: ""
	}
});

const CoopSchema = new mongoose.Schema({
	company: String,
	session: String,
	term: Number,
	isComplete: Boolean
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: String,
  name: String,
  sid: Number,
  bm: {
	  type: String,
	  default: 'TBD'
  },
  cohort: Number,
  coop: [CoopSchema],
  courses: [CourseSchema],
  remarks: {
	  type: RemarksSchema,
	  default: RemarksSchema
  }
});


/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};


/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});


module.exports = mongoose.model('User', UserSchema);
