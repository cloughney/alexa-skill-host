exports.default = {

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
        { name: "media-center", lambda: require('./src/media-center/lambda') },
        { name: "unicorn", lambda: require('./src/unicorn/lambda') },
        { name: "phone", lambda: require('./src/phone/lambda') }
    ]

};