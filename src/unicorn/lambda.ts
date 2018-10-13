import * as Alexa from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import * as request from 'request';

async function sendRequest(path: string, body?: any): Promise<void> {
    const options: request.CoreOptions = { method: 'POST', json: body };

    return new Promise<void>((resolve, reject) => {
        request(`http://192.168.1.110${path}`, options, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                reject(err || body);
            } else {
                resolve();
            }
        });
    });
}

const LightOnHandler: Alexa.RequestHandler = {
    canHandle(input) {
        const { request } = input.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'LightOn';
    },
    async handle(input) {
        console.log('Handling LightOn intent');
        try {
            sendRequest('/api/light/on');
        } catch (err) {
            return input.responseBuilder
                .speak('An error occurred while contacting the device.')
                .getResponse();
        }

        return input.responseBuilder.speak('Okay').getResponse();
    }
}

const LightOffHandler: Alexa.RequestHandler = {
    canHandle(input) {
        const { request } = input.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'LightOff';
    },
    async handle(input) {
        console.log('Handling LightOff intent');
        try {
            sendRequest('/api/light/off');
        } catch (err) {
            return input.responseBuilder
                .speak('An error occurred while contacting the device.')
                .getResponse();
        }

        return input.responseBuilder.speak('Okay').getResponse();
    }
}

const LightFlashHandler: Alexa.RequestHandler = {
    canHandle(input) {
        const { request } = input.requestEnvelope;
        return request.type === 'IntentRequest' && request.intent.name === 'LightOff';
    },
    async handle(input) {
        console.log('Handling LightFlash intent');

        const request = input.requestEnvelope.request as IntentRequest;
        const count = request.intent.slots && request.intent.slots['count']
            ? request.intent.slots['count'].value
            : undefined;
        
        if (!isNaN(count as any)) {
            return input.responseBuilder
                .speak("I don't know what's going on.")
                .getResponse();
        }

        try {
            sendRequest('/api/light/flash', { count });
        } catch (err) {
            return input.responseBuilder
                .speak('An error occurred while contacting the device.')
                .getResponse();
        }

        return input.responseBuilder.speak('Okay').getResponse();
    }
}

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LightOnHandler, LightOffHandler, LightFlashHandler)
    .lambda();
