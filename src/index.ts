import * as express from 'express';
import * as bodyParser from 'body-parser';
import context = require('aws-lambda-mock-context');
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';

import config from '../config';

function routeRequest(request: express.Request, response: express.Response, name: string, lambda: LambdaHandler): void {
    console.log('Accepting ' + name + ' request');

    const requestContext = context();
    lambda(request.body, requestContext, (err, result) => {
        console.log(err);
        console.log(result);

        if (err) {
            response.status(500).send();
            return;
        }

        response.status(200).json(result);
    });
}

const app = express()
    .use(bodyParser.json({ type: 'application/json' }));

config.lambdas.forEach(x =>
    app.post(`/alexa/${x.name}`, (req, res) => {
        console.log(req);
        console.log(x.lambda);
        routeRequest(req, res, x.name, x.lambda);
    }));

app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Alexa skill host is active. (${config.server.hostname}:${config.server.port})`);
});
