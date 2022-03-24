const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/secret');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost/secret')
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.use(expressValidator);
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
	console.log(`Secret-Server is running on port ${port}`);
})