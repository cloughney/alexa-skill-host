import * as Alexa from 'alexa-sdk';
//import { wake } from 'node-wol';

const powerHandlers = {
    'PowerOnIntent': function () {
        console.log('Handling PowerOnIntent');
        // wake(config.server.macAddress, err => {
        //     this.emit(':tell', err ? 'An error occurred when attempting to send the wake on LAN packet' : 'Okay');
        // });
    },
    'PowerOffIntent': function () {
        console.log('Handling PowerOffIntent');
        // const options = { 
        //     hostname: config.server.apiHost,
        //     port: config.server.apiPort,
        //     method: 'POST',
        //     path: '/applications/switch',
        //     body: { state: 'Hibernation' },
        //     rejectUnauthorized: false,
        //     headers: { 'Content-Type': 'application/json' }
        // };

        // const request = https.request(options, response => {
        //     this.emit(':tell', 'Okay');
        // });

        // request.on('error', err => { console.dir(err); this.emit(':tell', 'An error occurred when attempting to send the command'); });
        // request.end();
    }
};

exports.handler = function (event: Alexa.RequestBody<Alexa.Request>, context: Alexa.Context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(powerHandlers);
    alexa.execute();
};
