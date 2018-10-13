import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import * as http from 'http';

const colors: { [color: string ]: { r: number, g: number, b: number } } = {
    'red': { r: 255, g: 0, b: 0 },
    'green': { r: 0, g: 255, b: 0 },
    'blue': { r: 0, g: 0, b: 255 }
};

async function sendRequest(path: string, body?: any): Promise<void> {
    const options = {
        method: 'POST', 
        hostname: '192.168.1.174', port: 80,
        path, body, rejectUnauthorized: false,
        headers: { 'Content-Type': 'application/json' }
    };

    return new Promise<void>((resolve, reject) => {
        http.request(options, () => resolve())
            .on('error', err => reject(err))
            .end();
    });
}

const SetColorHandler: Alexa.RequestHandler = {
    canHandle(input) {
        const { request } = input.requestEnvelope;
        // request.type === 'LaunchRequest' ?
        return request.type === 'IntentRequest' && request.intent.name === 'SetColor';
    },
    async handle(input) {
        console.log('Handling SetColor intent');

        const request = input.requestEnvelope.request as IntentRequest;
        const colorInput = request.intent.slots && request.intent.slots['color']
            ? request.intent.slots['color'].value
            : undefined;
        
        if (!colorInput || colorInput === '?') {
            return input.responseBuilder
                .speak("I don't know what's going on.")
                .getResponse();
        }

        const color = colors[colorInput];
        if (!color) {
            return input.responseBuilder
                .speak("I don't know how to make that color.")
                .getResponse();
        }

        try {
            await sendRequest('/api/lights/1', { mode: 'color', color });
        } catch (err) {
            console.dir(err);
            return input.responseBuilder
                .speak('An error occurred while contacting the device.')
                .getResponse();
        }

        return input.responseBuilder
            .speak('Okay')
            .getResponse();
    }
}

const TurnOffHandler: Alexa.RequestHandler = {
    canHandle(input) {
        const { request } = input.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'TurnOff';
    },
    async handle(input) {
        console.log('Handling TurnOff intent');

        try {
            await sendRequest('/api/lights/1', { mode: 'off' });
        } catch (err) {
            console.dir(err);
            return input.responseBuilder
                .speak('An error occurred while contacting the device.')
                .getResponse();
        }

        return input.responseBuilder
            .speak('Okay')
            .getResponse();
    }
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        SetColorHandler,
        TurnOffHandler
    )
    .lambda();
    