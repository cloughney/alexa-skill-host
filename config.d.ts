import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';

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
    lambda: { handler: LambdaHandler };
}

interface Configuration {
    server: ServerConfiguration;
    lambdas: LambdaModuleConfiguration[];
}

declare const config: Configuration;
export default config;