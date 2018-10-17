import * as Alexa from 'ask-sdk-core';
import { Request, Response } from 'ask-sdk-model';

export type RequestHandlerFunction<T> = (input: Alexa.HandlerInput, request: T) => Response | Promise<Response>;
export type RequestHandlerCondition<T> = (input: Alexa.HandlerInput, request: T) => boolean | Promise<boolean>;

export class RequestHandler implements Alexa.RequestHandler {
    private readonly handlers: Map<Request['type'], { handler: RequestHandlerFunction<any>, condition?: RequestHandlerCondition<any> }>;

    public constructor() {
        this.handlers = new Map();
    }

    public addRequestHandler<T>(type: Request['type'], handler: RequestHandlerFunction<T>, condition?: RequestHandlerCondition<T>): RequestHandler {
        this.handlers.set(type, { handler, condition });
        return this;
    }

    public async canHandle(input: Alexa.HandlerInput) {
        const { request } = input.requestEnvelope;
        const container = this.handlers.get(request.type);
        return !!container && !!container.condition && await container.condition(input, request);
    }

    public handle(input: Alexa.HandlerInput) {
        const { request } = input.requestEnvelope;
        const container = this.handlers.get(request.type);

        if (!container) {
            console.error(`No handler found for request type '${request.type}'.`);
            return input.responseBuilder
                .speak("I can't handle that request.")
                .getResponse();
        }

        return container.handler(input, request);
    }
}