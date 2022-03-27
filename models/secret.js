const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { encrypt, decrypt } = require('../crypto/crypto');

const Secret = new Schema({
	hash: {
		type: String,
		required: true,
		index: {unique: true}
	},
	secretText: {
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
	}
}, {
	versionKey: false
});

Secret.pre('save', function(next) {
	this.secretText = encrypt(this.secretText);
	next();
});

Secret.post('findOne', function(secret) {
	if(secret != null) {
		secret.secretText = decrypt(secret.secretText);
	}
});

Secret.post('find', function(secrets) {
	if(secrets != null) {
		secrets.forEach(secret => {
			secret.secretText = decrypt(secret.secretText);
		});
	}
});

module.exports = mongoose.model('Secret', Secret);