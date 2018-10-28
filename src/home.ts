import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as request from 'request';
import { DeviceType, DeviceCapabilities, devices } from './data';

const colors: { [color: string ]: { r: number, g: number, b: number } } = {
    'red': { r: 255, g: 0, b: 0 },
    'green': { r: 0, g: 255, b: 0 },
    'blue': { r: 0, g: 0, b: 255 }
};

async function sendRequest(url: string, body?: any): Promise<void> {
    const options: request.CoreOptions = { method: 'POST', json: body };

    return new Promise<void>((resolve, reject) => {
        request(url, options, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                reject(err || body);
            } else {
                resolve();
            }
        });
    });
}

interface SuccessResponse {
    code: 200;
    body: any;
}

interface NoContentSuccessResponse {
    code: 204;
}

interface NotFoundResponse {
    code: 404;
}

type Response = SuccessResponse | NoContentSuccessResponse | NotFoundResponse;

async function handleRequest(req: express.Request, res: express.Response, handler: () => Promise<Response>): Promise<void> {
    const response = await handler();

    res.status(response.code || 200);

    if ('body' in response) {
        res.json(response.body);
    } else {
        res.send();
    }
}

async function listDevices(): Promise<Response> {
    return {
        code: 200,
        body: devices.map(x => ({
            id: x.id,
            type: DeviceType[x.type],
            capabilities: [
                ...x.capabilities & DeviceCapabilities.Power ? [ 'POWER' ] : [],
                ...x.capabilities & DeviceCapabilities.Brightness ? [ 'BRIGHTNESS' ] : [],
                ...x.capabilities & DeviceCapabilities.Color ? [ 'COLOR' ] : [],
            ]
        }))
    };
}

async function getDeviceState(id: string): Promise<Response> {
    const device = devices.find(x => x.id === id);

    return device ? { code: 200, body: {} } : { code: 404 };
}

async function setDevicePowerState(id: string, state: 'on' | 'off'): Promise<Response> {
    const device = devices.find(x => x.id === id);

    return device ? { code: 200, body: {} } : { code: 404 };
}

export const homeApiRouter = express.Router()
    .get('/devices', (req, res) => handleRequest(req, res, listDevices))
    .get('/devices/:id', (req, res) => handleRequest(req, res, getDeviceState.bind(null, req.params.id)))
    .post('/devices/:id/power/:state(on|off)', (req, res) => handleRequest(req, res, setDevicePowerState.bind(null, req.params.id, req.params.state)));