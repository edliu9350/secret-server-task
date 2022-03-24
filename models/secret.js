const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Secret = new Schema({
	url: {
		type: String,
		required: true,
		index: {unique: true}
	},
	text: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true
	},
	expiresAt: {
		type: Date,
		required: true
	},
	lifeCount: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Secret', Secret);