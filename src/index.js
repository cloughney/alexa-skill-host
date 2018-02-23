"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const context = require("aws-lambda-mock-context");
const config_1 = require("../config");
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
config_1.default.lambdas.forEach(x => app.post(`/alexa/${x.name}`, (req, res) => {
    routeRequest(req, res, x.name, x.lambda);
}));
const server = https.createServer({
    cert: fs.readFileSync(config_1.default.server.certs.domain),
    key: fs.readFileSync(config_1.default.server.certs.domainKey),
    ca: fs.readFileSync(config_1.default.server.certs.ca)
}, app);
server.listen(config_1.default.server.port, config_1.default.server.hostname, () => {
    console.log(`Alexa skill host is active. (${config_1.default.server.hostname}:${config_1.default.server.port})`);
});
//# sourceMappingURL=index.js.map