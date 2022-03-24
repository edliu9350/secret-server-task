const { body } = require('express-validator/check');

const validate = (type) => {
	switch(type) {
		case 'getSecret':
			return [
				body('url', 'Url is empty').exists()
			]
		case 'updateSecret':
			return [
				body('text', 'Secret text is empty').exists(),
				body('expiresAfter', 'Invalid number').exists().isInteger(),
				body('lifeCount', 'Invalid number').exists().isInteger()
			]
		default:
			return []
	}
}

module.exports = validate;