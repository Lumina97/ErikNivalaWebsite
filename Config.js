const pino = require('pino');
const pinoPretty = require('pino-pretty');
const path = require('path');
const rfs = require('rotating-file-stream');


const logFilePath = path.join(__dirname, "Log");
const logStream = rfs.createStream('app.log', {
    interval: '1d', // Rotate daily
    path: logFilePath,
});

const log = pino({ level: 'info' }, pinoPretty({ colorize: true }), logStream);

module.exports = {
    log
};