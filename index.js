const path = require('path');
const envPath = path.join(__dirname, 'website.env');
require('dotenv').config({ path: envPath });

const express = require('express');
const RedditAPI = require('./RedditAPI/RedditAPI');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const compression = require('compression');
const MongoStore = require('connect-mongo');
const log = require('./Config').log;
const app = express();

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb' }));

const oneDay = 1000 * 60 * 60 * 24;
const secretKey = uuidv4();
var sessionArray = new Array();
var downloadRequestDict = {};

const connectionURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
const mongodbStore = MongoStore.create({
    mongoUrl: connectionURL,
    ttl: oneDay,
    autoRemove: 'native',
    collection: 'sessions'
});

app.use(session({
    name: 'SessionCookie',
    genid: function () {
        log.info('session id created');
        return uuidv4();
    },
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: mongodbStore,
    cookie: { secure: false, maxAge: oneDay }
}));

const port = 3000;
app.listen(port, () => log.info("listening on " + port));

//#region Image Gatherer
app.post('/download', async function (request, response) {
    log.info('Download POST request');

    if (!request.session) {
        log.warn("Session ID was invalid - Download request");
        response({ "Error": "There was an error with your download request!" });
        return;
    }

    log.info(request.body);
    const path = request.body.path;
    downloadRequestDict[request.sessionID] = path;
    log.info(downloadRequestDict);

    var data;
    try {
        data = JSON.stringify("Sucess");
        response.json(data);
    }
    catch (e) {
        log.error('ERROR:\n' + e);
    }
});

app.get('/download', async function (request, response) {
    log.info('Download GET request');

    for (const [key, value] of Object.entries(downloadRequestDict)) {
        log.info(key, value);
        if (key == request.sessionID) {
            log.info('Found request!');
            const path = value;
            log.info(path);
            response.download(path);
            delete downloadRequestDict[key];
        }
    }
})

app.post('/ImageLoader', async function (request, response) {

    if (!request.session) {
        log.warn('Invalid Session!');
        response.json({ "ERROR": "Invalid Session, try reloading the page!" });
        return;
    }

    const data = request.body;
    if (data.subreddit == false) {
        log.warn("Subreddit was empty!");
        response.json({ "ERROR": "Subreddit was empty!" });
        return;
    }

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount, session, data.filters)
        .then((result) => {
            var returnData;
            try {
                returnData = JSON.stringify({ 'path': result });
                response.json(returnData);
                return;
            }
            catch (error) {
                log.warn('Error parsing json! \n' + error);
                response.json('There was an error getting your data!');
                return;
            }
        })
        .catch((error) => {
            log.error("ERROR: " + error);
            response.json({ "ERROR": "There was an error getting your data!" });
            return;
        });
})
//#endregion 

//#region File Serving
app.get('/spacetrace', (response) => {
    response.sendFile(path.join(pth.join(__dirname, '/public/spacetrace/index.html')));
})

app.get('/', (request, response) => {

    if (!request.session) {
        const session = request.session;
        session.id = request.genid;
        session.userid = request.body.username;
        session.maxAge = oneDay;
        request.session = session;

        request.session.save(err => {
            if (err) {
                log.error(err);
            }
        });
    }
    response.sendFile(path.join(__dirname, '/public/html/Home.html'));
})
//#endregion