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
        { name: "media-center", lambda: require('./dist/media-center/lambda') },
        { name: "unicorn", lambda: require('./dist/unicorn/lambda') },
        { name: "phone", lambda: require('./dist/phone/lambda') }
    ]

};