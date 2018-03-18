import * as express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import context = require('aws-lambda-mock-context');

import config from '../config';

function routeRequest(request: any, response: any, name: string, lambda: any): void {
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
        routeRequest(req, res, x.name, x.lambda);
    }));

app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Alexa skill host is active. (${config.server.hostname}:${config.server.port})`);
});
