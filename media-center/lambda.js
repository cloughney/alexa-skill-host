'use strict'

const Alexa = require('alexa-sdk');
const wol = require('node-wol');
const https = require('https');

const config = require('../config.json');

const powerHandlers = {
    'PowerOnIntent': function () {
        console.log('Handling PowerOnIntent');
        wol.wake(config.server.macAddress, err => {
            this.emit(':tell', err ? 'An error occurred when attempting to send the wake on LAN packet' : 'Okay');
        });
    },
    'PowerOffIntent': function () {
        console.log('Handling PowerOffIntent');
        const options = { 
            hostname: config.server.apiHost,
            port: config.server.apiPort,
            method: 'POST',
            path: '/applications/switch',
            body: { state: 'Hibernation' },
            rejectUnauthorized: false,
            headers: { 'Content-Type': 'application/json' }
        };

        const request = https.request(options, response => {
            this.emit(':tell', 'Okay');
        });

        request.on('error', err => { console.dir(err); this.emit(':tell', 'An error occurred when attempting to send the command'); });
        request.end();
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(powerHandlers);
    alexa.execute();
};
