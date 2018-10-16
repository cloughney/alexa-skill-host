import * as express from 'express';
import * as bodyParser from 'body-parser';
import context = require('aws-lambda-mock-context');
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';

import config from '../config';

function routeRequest(request: express.Request, response: express.Response, name: string, handler: LambdaHandler): void {
    console.log('Accepting ' + name + ' request');

    const requestContext = context();
    handler(request.body, requestContext, (err, result) => {
        if (err) {
            console.dir(err);
            response.status(500).send();
            return;
        }

        response.status(200).json(result);
    });
}

const app = express()
    .use(bodyParser.json({ type: 'application/json' }));

config.skills.forEach(skill => {
    app.post(`/alexa/${skill.name}`, (req, res) => {
        routeRequest(req, res, skill.name, skill.module.handler);
    });
});

app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Alexa skill host is active. (${config.server.hostname}:${config.server.port})`);
});
