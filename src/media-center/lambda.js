"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const powerHandlers = {
    'PowerOnIntent': function () {
        console.log('Handling PowerOnIntent');
    },
    'PowerOffIntent': function () {
        console.log('Handling PowerOffIntent');
    }
};
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(powerHandlers);
    alexa.execute();
};
//# sourceMappingURL=lambda.js.map