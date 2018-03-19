import * as Alexa from 'alexa-sdk'
import { IncomingMessage } from 'http';
import { request as createHttpsRequest } from 'https';

import UserService, { User } from '../users/user-service';

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
    'LocatePhone': async function() {
        console.log('Handling LocatePhone intent.');

        try {
            const userService = new UserService();
            const userId = this.event.session.user.userId;
            const user = await userService.getUserByAmazonId(userId);

            if (user === undefined) {
                console.warn(`Cannot find user with ID ${userId}.`);
                return this.emit(':tell', 'I have no idea where your phone is.');
            }

            const { apiKey, deviceId } = user.integrations['join'];

            await sendRequest(apiKey, deviceId, { find: true });

            this.emit(':tell', `Do you hear it?`)
        } catch (err) {
            console.error('Cannot handle the LocatePhone intent.');
            console.dir(err);

            this.emit(':tell', 'Something went wrong!');
        }
    }
};

exports.handler = function (event: Alexa.RequestBody<Alexa.Request>, context: Alexa.Context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
