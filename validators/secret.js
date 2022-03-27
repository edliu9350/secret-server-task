const { body, param } = require('express-validator');

const validate = (type) => {
	switch(type) {
		case 'getSecretByHash':
			return [
				param('hash', 'Hash is empty').exists()
			]
		case 'addSecret':
			return [
				body('secret', 'Secret text is empty').exists(),
				body('expireAfter', 'Invalid number').exists()
			]
		default:
			return []
	}
}

module.exports = validate;