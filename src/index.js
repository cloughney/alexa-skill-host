'use strict';

const config = require('../config');

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

const server = https.createServer({
    cert: fs.readFileSync(config.server.certs.domain),
    key: fs.readFileSync(config.server.certs.domainKey),
    ca: fs.readFileSync(config.server.certs.ca)
}, app);

server.listen(config.server.port, config.server.hostname, () => {
    console.log('Alexa skill host is active.');
});
