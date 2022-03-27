const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/secret');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger/swagger.yaml');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(
	'mongodb+srv://edliu9350:password9350@cluster0.cylij.mongodb.net/secret?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

app.use(bodyParser.urlencoded({
	extended: true
}));

//JSON parser
app.use(bodyParser.json());
//YAML parser
app.use(express.raw({ type: 'application/yaml' }));

//Response Middleware
app.use((req, res, next) => {
	let fnSend = res.send;
	res.send = function (body) {
		let acceptHeader = req.header('accept');
		if(acceptHeader == 'application/yaml')
			fnSend.call(res, YAML.stringify(body));
		else fnSend.call(res, body);
	}
	next();
});

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
//static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Secret-Server is running on port ${port}`);
})