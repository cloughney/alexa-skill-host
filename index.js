'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const context = require('aws-lambda-mock-context');

const lambda = require('./lambda');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/alexa/', (req, res) => {
    const requestContext = context();
    lambda.handler(req.body, requestContext);
    requestContext.Promise
        .then(x => { return res.status(200).json(x); })
        .catch(x => { console.log(x); });
});


const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);

server.listen(443, '0.0.0.0', () => {
    console.log('Alexa skill host is active.');
});
