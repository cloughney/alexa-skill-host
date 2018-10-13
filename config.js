exports.default = {
    server: {
        hostname: '0.0.0.0',
        port: 8081
    },
    lambdas: [
        { name: "couch", lambda: require('./dist/couch/lambda') },
        { name: "unicorn", lambda: require('./dist/unicorn/lambda') }
    ]
};