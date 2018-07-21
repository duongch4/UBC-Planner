const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	id: {
		type: String,
		default: ""
	},
	isGradApproved: {
		type: Number,
		default: ""
	},
	creditFor: {
		type: String,
		default: ""
	},
	section: {
		type: String,
		default: ""
	},
	credit: {
		type: Number,
		default: 3
	},
	grade: {
		type: Number
	},
	year: {
		type: String,
	},
	term: {
		type: Number
	}
});

module.exports = mongoose.model('CourseSchema', CourseSchema);
