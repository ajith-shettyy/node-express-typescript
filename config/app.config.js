const convict = require('convict')

const config = convict({
    app: {
        doc: 'App name',
        default: 'Test Service',
        env: 'APP_NAME',
    },
    http: {
        port: {
            doc: 'the port to listen on',
            default: 3040,
            env: 'SAMPLE_APP_PORT',
        },
    },
    log: {
        level: {
            doc: 'default log level',
            default: 'info',
        },
        timestampformat: {
            doc: 'timestamp format for log',
            default: 'YYYY-MM-D HH:mm:ss.SSS',
        },
    },
})

config.validate()

module.exports = {
    config,
}
