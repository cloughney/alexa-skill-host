import * as Alexa from 'alexa-sdk'
import { IncomingMessage } from 'http';
import { request as createHttpsRequest } from 'https';

function sendRequest(apiKey: string, deviceId: string, fields: { [fieldName: string]: any }): Promise<IncomingMessage> {
    //TODO config this
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
        const request = createHttpsRequest(options, resolve);
        request.on('error', reject);
        request.end();
    });
}

const handlers: Alexa.Handlers<Alexa.Request> = {
    'LocatePhone': function () {
        console.log('Handling LocatePhone intent.');

        const user = null; //TODO db stuff

        // if (!user) {
        //     console.log(`Cannot find uid ${userId}.`);
        //     this.emit(':tell', 'I have no idea where your phone is.');
        //     return;
        // }
        
        // sendRequest(user.join.apiKey, user.join.deviceId, { find: true })
        //     .then(() => { this.emit(':tell', `Do you hear it?`) })
        //     .catch(err => { console.dir(err); });
    }
};

exports.handler = function (event: Alexa.RequestBody<Alexa.Request>, context: Alexa.Context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};