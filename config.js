module.exports = {

    server: {
        hostname: '0.0.0.0',
        port: 443,
        certs: {
            domain: process.env['LAMBDA_DOMAIN_CERT'],
            domainKey: process.env['LAMBDA_DOMAIN_KEY'],
            ca: process.env['LAMBDA_CA_CERT']
        }
    },

    lambdas: [
        { "name": "media-center", "handler": require('./src/media-center/lambda') },
        { "name": "unicorn", "handler": require('./src/unicorn/lambda') },
        { "name": "phone", "handler": require('./src/phone/lambda') }
    ]

};