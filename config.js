exports.default = {

    server: {
        hostname: '0.0.0.0',
        port: 8081
    },

    lambdas: [
        { name: "media-center", lambda: require('./dist/media-center/lambda') },
        { name: "unicorn", lambda: require('./dist/unicorn/lambda') },
        { name: "phone", lambda: require('./dist/phone/lambda') }
    ]

};