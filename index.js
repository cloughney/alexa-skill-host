'use strict';

const config = require('./config');

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const context = require('aws-lambda-mock-context');

function routeRequest(request, response, name, lambda) {
    console.log('Accepting ' + name + ' request');

    const requestContext = context();
    requestContext.Promise
        .then(x => { return response.status(200).json(x); })
        .catch(x => { console.log(x); });

    
    lambda.handler(request.body, requestContext);
}

const app = express()
    .use(bodyParser.json({ type: 'application/json' }));

config.lambdas.forEach(x => 
    app.post(`/alexa/${x.name}`, (req, res) => {
        routeRequest(req, res, x.name, x.handler);
    }));

app.all('/.well-known/acme-challenge/knbQ8Y6VhPU3_AvQVSFd54HV7j7t6FqR1KwbO0l9fmo', (req, res) => { res.status(200).send('knbQ8Y6VhPU3_AvQVSFd54HV7j7t6FqR1KwbO0l9fmo'); })

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app);

server.listen(443, '0.0.0.0', () => {
    console.log('Alexa skill host is active.');
});
