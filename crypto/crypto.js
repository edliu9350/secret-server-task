const crypto = require('crypto');
const iv = crypto.randomBytes(16);
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const encrypt = (text) => {
	if(text == undefined || text == '')
		return text;
	if (text.startsWith('{"iv":'))
		return text;
	const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
	return JSON.stringify({
		iv: iv.toString('hex'),
		content: encrypted.toString('hex')
	});
}

const decrypt = (text) => {
	try{
		if(text == undefined || text == '')
			return text;
		if(!text.startsWith('{"iv":'))
			return text;
		text = JSON.parse(text);
		const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(text.iv, 'hex'));
		const decrypted = Buffer.concat([decipher.update(Buffer.from(text.content, 'hex')), decipher.final()]);
		return decrypted.toString();
	} catch(err) {
		return "Error occured";
	}
}

module.exports = {
	encrypt,
	decrypt
}