import * as express from 'express';
import * as request from 'request';
import { DeviceType, DeviceCapabilities, devices } from './data';

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

interface ErrorResponse {
    code: 400 | 404;
}

type Response = SuccessResponse | NoContentSuccessResponse | ErrorResponse;

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

    if (!device) {
        return { code: 404 };
    }

    if (state === 'on') {
        sendRequest(`${device.endpoint}`, {
            mode: 'color',
            color: { r: 128, g: 128, b: 128 }
        });
    } else {
        sendRequest(`${device.endpoint}`, { mode: 'off' });
    }

    return { code: 204 };
}

async function setDeviceBrightnessLevel(id: string, state: unknown): Promise<Response> {
    if (typeof state !== 'object' || state === null || !('level' in state)) {
        return { code: 400 };
    }

    const level: unknown | number = (state as any).level as unknown;
    if (typeof level !== 'number' || level < 1 || level > 100) {
        return { code: 400 };
    }

    const device = devices.find(x => x.id === id);

    if (!device) {
        return { code: 404 };
    }

    sendRequest(`${device.endpoint}`, { mode: 'brightness', level });

    return { code: 204 };
}

async function setDeviceColor(id: string, state: unknown): Promise<Response> {
    const isValidState = typeof state === 'object' && state !== null && 'r' in state && 'g' in state && 'b' in state;
    if (!isValidState) {
        return { code: 400 };
    }

    const device = devices.find(x => x.id === id);

    if (!device) {
        return { code: 404 };
    }

    sendRequest(`${device.endpoint}`, { mode: 'color', color: state });

    return { code: 204 };
}

export const homeApiRouter = express.Router()
    .get('/devices', (req, res) => handleRequest(req, res, listDevices))
    .get('/devices/:id', (req, res) => handleRequest(req, res, getDeviceState.bind(null, req.params.id)))
    .post('/devices/:id/power/:state(on|off)', (req, res) => handleRequest(req, res, setDevicePowerState.bind(null, req.params.id, req.params.state)))
    .post('/devices/:id/brightness', (req, res) => handleRequest(req, res, setDeviceBrightnessLevel.bind(null, req.params.id, req.body)))
    .post('/devices/:id/color', (req, res) => handleRequest(req, res, setDeviceColor.bind(null, req.params.id, req.body)));