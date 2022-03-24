const { Keccak } = require('sha3');
const { Secret } = require('../models/secret');
const { validationResult } = require('express-validator/check');

const getSecret = (req, res) => {
	const errors = validationResult(req);
	/*validation*/
	if(!errors.isEmpty()) {
		res.status(422).json({ errors });
		return;
	}
	/*get secret by url*/
	Secret.findOne({
		url: req.params.url
	})
	.then(sec => {
		if(!sec) {
			return res.status(400).send('Secret not found');
		}
		if(sec.lifeCount <= 0 || new Date() >= sec.expiresAt) {
			return res.status(400).send('Secret expired');
		}
		/*decrease lifeCount*/
		sec.lifeCount--;
		sec.save()
			.then(() => {
				res.json(sec);
			})
			.catch((err) => {
				res.status(400).json({
					message: 'Error updating secret',
					error: err
				})
			})
	})
	.catch(err => {
		return res.status(500).json({
			message: 'Error fetching data',
			error: err
		});
	});
};

const createSecret = (req, res) => {
	const keccak = new Keccak(256);
	const now = new Date();
	const hash = Keccak.update(req.body.text, 'utf-8').digest('hex');
	let secret = new Secret({
		url: hash,
		text: req.body.text,
		createdAt: now,
		expiresAt: new Date(now.getTime() + parseInt(req.body.expiresAfter) * 60000),
		lifeCount: req.body.lifeCount
	});
	secret.save()
		.then(() => {
			res.json({
				message: 'Secret saved',
				url: `/api/secret/${hash}`
			})
		})
		.catch(err => {
			res.json({
				message: 'Error creating new secret',
				error: err
			})
		})
}

const updateSecret = (req, res) => {
	const secretBody = req.body;
	const errors = validationResult(req);
	/*validation*/
	if(!errors.isEmpty()) {
		res.status(422).json({ errors });
		return;
	}
	/*update secret*/
	Secret.findOne({ url: req.url})
		.then(sec => {
			if(!sec) {
				if(req.body.url == undefined) {
					/*add new secret*/
					createSecret(req, res);
				} else {
					/*Couldn't find secret*/
					res.status(400).send("Secret doesn't exist");
				}
			} else {
				/*update old secret*/
				const now = new Date();
				secret.text = req.body.text;
				secret.expiresAt = new Date(now.getTime() + req.body.expiresAfter * 60000);
				secret.save()
					.then(() => {
						res.json('Secret updated');
					})
					.catch((err) => {
						res.json({
							message: 'Error updating secret',
							error: err
						})
					})
			}
		})
		.catch(err => {
			res.status(500).json({
				message: 'Server error when updating secret',
				error: err.toString()
			})
		});
};

module.exports = {
	getSecret,
	updateSecret
};