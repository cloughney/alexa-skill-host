import { LambdaHandler } from "ask-sdk-core/dist/skill/factory/BaseSkillFactory";

export interface SkillConfiguration {
    readonly name: string;
    readonly module: { handler: LambdaHandler };
}

export default {
    server: {
        hostname: '0.0.0.0',
        port: 8081
    },
    skills: [
        {
            name: 'couch',
            module: require('./src/couch/module')
        },
        {
            name: 'unicorn',
            module: require('./src/unicorn/module')
        }
    ] as SkillConfiguration[]
}