'use strict'

const Alexa = require('alexa-sdk');
const http = require('http');

const config = require('../config.json');

function sendRequest(alexa, path, body) {
    const options = { 
        hostname: '192.168.1.110',
        port: 80,
        method: 'POST',
        path,
        body,
        rejectUnauthorized: false,
        headers: { 'Content-Type': 'application/json' }
    };

    const request = http.request(options, response => {
        alexa.emit(':tell', 'Okay');
    });

    request.on('error', err => { console.dir(err); alexa.emit(':tell', 'An error occurred when attempting to send the command'); });
    request.end();
}

const powerHandlers = {
    'LightOn': function () {
        console.log('Handling LightOn intent');
        sendRequest(this, '/api/light/on');
    },
    'LightOff': function () {
        console.log('Handling LightOff intent');
        sendRequest(this, '/api/light/off');
    },
    'LightFlash': function () {
        console.log('Handling LightFlash intent');

        const countSlot = this.event.request.intent.slots['count'];
        const count = countSlot && !isNaN(countSlot.value) ? countSlot.value : 2;

        sendRequest(this, '/api/light/flash', { count });
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(powerHandlers);
    alexa.execute();
};
