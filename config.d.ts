import { Handler, Request } from 'alexa-sdk';

interface ServerConfiguration {
    hostname: string;
    port: number;
    certs: {
        domain: string;
        domainKey: string;
        ca: string;
    }
}

interface LambdaModuleConfiguration {
    name: string;
    lambda: Handler<Request>;
}

interface Configuration {
    server: ServerConfiguration;
    lambdas: LambdaModuleConfiguration[];
}

declare const config: Configuration;
export default config;