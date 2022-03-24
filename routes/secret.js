const { Router } = require('express');
const controller = require('../controllers/secret');
const validate = require('../validators/secret');

const router = Router();

router.get('/secret/:url', validate('getSecret'), controller.getSecret);
router.post('/secret/', validate('updateSecret'), controller.updateSecret);

module.exports = router;