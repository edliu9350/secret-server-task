const { Keccak } = require('sha3');
const Secret = require('../models/secret');
const { validationResult } = require('express-validator');
const { encrypt, decrypt } = require('../crypto/crypto');


const getSecretByHash = (req, res) => {
	/*validation*/
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		res.status(422).send({ errors });
		return;
	}
	/*get secret by url*/
	Secret.findOne({
		hash: req.params.hash
	})
	.then(sec => {
		if(!sec) {
			return res.status(400).send('Secret not found');
		}
		if(new Date() >= sec.expiresAt) {
			return res.status(400).send('Secret expired');
		}
		res.send(sec);
	})
	.catch(err => {
		return res.status(500).send({
			message: 'Error fetching data',
			error: err
		});
	});
};

const addSecret = (req, res) => {
	/*validation*/
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		res.status(422).send({ errors });
		return;
	}
	/*add secret*/
	const keccak = new Keccak(256);
	const now = new Date();
	const hash = keccak.update(String(new Date()), 'utf-8').digest('hex');
	let secret = new Secret({
		hash,
		secretText: req.body.secret,
		createdAt: now,
		expiresAt: new Date(now.getTime() + parseInt(req.body.expireAfter) * 60000)
	});
	secret.save()
		.then((sec) => {
			sec.secretText = decrypt(sec.secretText);
			res.send({
				message: 'Secret saved',
				secret: sec,
				url: `/api/secret/${hash}`
			})
		})
		.catch(err => {
			res.status(500).send({
				message: 'Error creating new secret',
				error: err
			})
		})
}

const getSecrets = (req, res) => {
	const now = new Date();
	Secret.find({})
		.then(secs => {
			secs.forEach(sec => {
				if(sec.expiresAt <= now) {
					sec.secretText = '';
				}
			});
			res.json(secs);
		})
		.catch(err => {
			res.status(500).send({
				message: 'Error fetching data',
				error: err
			})
		})
}

module.exports = {
	getSecretByHash,
	addSecret,
	getSecrets
};