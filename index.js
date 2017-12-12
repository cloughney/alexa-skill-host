'use strict';

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const context = require('aws-lambda-mock-context');

const mediaCenterLambda = require('./media-center/lambda');
const unicornLambda = require('./unicorn/lambda');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

function routeRequest(request, response, name, lambda) {
    console.log('Accepting ' + name + ' request');
    const requestContext = context();
    lambda.handler(request.body, requestContext);
    requestContext.Promise
        .then(x => { return response.status(200).json(x); })
        .catch(x => { console.log(x); });
}

app.post('/alexa/media-center', (req, res) => { routeRequest(req, res, 'media-center', mediaCenterLambda); });
app.post('/alexa/unicorn', (req, res) => { routeRequest(req, res, 'unicorn', unicornLambda); });

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);

server.listen(443, '0.0.0.0', () => {
    console.log('Alexa skill host is active.');
});
