const { Router } = require('express');
const controller = require('../controllers/secret');
const validate = require('../validators/secret');

const router = Router();

router.get('/secret/:hash', validate('getSecretByHash'), controller.getSecretByHash);
router.post('/secret/', validate('addSecret'), controller.addSecret);
router.delete('/secrets/', controller.deleteSecrets);
router.get('/secrets/', controller.getSecrets);

module.exports = router;