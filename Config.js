const pino = require('pino');
const pinoPretty = require('pino-pretty');
const path = require('path');


const logPath = path.join(__dirname, "Log", "app.log");

const transport = pino.transport({
    targets: [
        {
            level: 'trace',
            target: 'pino/file',
            options: {
                destination: logPath,
            },
        },
        {
            level: 'trace',
            target: 'pino-pretty',
            options: {},
        },
    ],
});

// Create the Pino logger with pretty-printing for console
const log = pino(transport);

module.exports = {
    log
};