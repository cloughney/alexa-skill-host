'use strict'

const Alexa = require('alexa-sdk');
const https = require('https');

//const config = require('../config.secret.json');

function getUserFromConfig(session, config) {
    const userId = session.user.userId;
    const username = Object.getOwnPropertyNames(config.users)
        .find(x => config.users[x].uid === userId);

    return config.users[username];
}

function sendRequest(apiKey, deviceId, fields) {
    const hostname = 'joinjoaomgcd.appspot.com';
    const rootPath = '/_ah/api/messaging/v1/sendPush';

    fields = fields || {};
    fields['apikey'] = apiKey;
    fields['deviceId'] = deviceId;

    const params = Object.getOwnPropertyNames(fields)
        .map(fieldName => `${fieldName}=${encodeURIComponent(fields[fieldName])}`)
        .join('&');

    const options = { 
        hostname,
        method: 'GET',
        path: `${rootPath}?${params}`
    };

    return new Promise((resolve, reject) => {
        const request = https.request(options, response => { resolve(response); });
        request.on('error', reject);
        request.end();
    });
}

const handlers = {
    'LocatePhone': function () {
        console.log('Handling LocatePhone intent.');

        const user = getUserFromConfig(this.event.session, config);

        if (!user) {
            console.log(`Cannot find uid ${userId}.`);
            this.emit(':tell', 'I have no idea where your phone is.');
            return;
        }
        
        sendRequest(user.join.apiKey, user.join.deviceId, { find: true })
            .then(() => { this.emit(':tell', `Do you hear it?`) })
            .catch(err => { console.dir(err); });
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};