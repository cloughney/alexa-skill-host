"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const https_1 = require("https");
function sendRequest(apiKey, deviceId, fields) {
    const hostname = 'joinjoaomgcd.appspot.com';
    const rootPath = '/_ah/api/messaging/v1/sendPush';
    fields = fields || {};
    fields['apikey'] = apiKey;
    fields['deviceId'] = deviceId;
    const queryParams = Object.getOwnPropertyNames(fields)
        .map(fieldName => encodeURI(`${fieldName}=${fields[fieldName]}`))
        .join('&');
    const options = {
        hostname,
        method: 'GET',
        path: `${rootPath}?${queryParams}`
    };
    return new Promise((resolve, reject) => {
        const request = https_1.request(options, resolve);
        request.on('error', reject);
        request.end();
    });
}
const handlers = {
    'LocatePhone': function () {
        console.log('Handling LocatePhone intent.');
        const user = null;
    }
};
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
//# sourceMappingURL=lambda.js.map