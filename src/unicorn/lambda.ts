import * as Alexa from 'alexa-sdk';
import * as http from 'http';

function sendRequest(alexa: Alexa.Handler<Alexa.Request>, path: string, body?: any) {
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

const powerHandlers: Alexa.Handlers<Alexa.Request> = {
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

        const countSlot = { value: 0 }; // this.event.request.intent.slots['count'];
        const count = countSlot && !isNaN(countSlot.value) ? countSlot.value : 2;

        sendRequest(this, '/api/light/flash', { count });
    }
};

exports.handler = function (event: Alexa.RequestBody<Alexa.Request>, context: Alexa.Context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(powerHandlers);
    alexa.execute();
};
