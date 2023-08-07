const express = require('express');
const RedditAPI = require('./RedditAPI/RedditAPI');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const compression = require('compression');
const log = require('./Config').log;
const app = express();
const path = require('path');

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb' }));

const oneDay = 1000 * 60 * 60 * 24;
const secretKey = uuidv4();
var sessionArray = new Array();
var downloadRequestDict = {};

app.use(session({
    name: 'SessionCookie',
    genid: function () {
        log.info('session id created');
        return uuidv4();
    },
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: oneDay }
}));

app.listen(3000, () => log.info("listening on 3000"));

//-----------------------------------------------------------------------
//--------------------------Image Gatherer-------------------------------
//-----------------------------------------------------------------------

app.post('/download', async function (request, response) {
    log.info('Download POST request');

    if (DoesSessionExist(request.sessionID) === false) {
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

    if (DoesSessionExist(request.session.id) === false) {
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

//-----------------------------------------------------------------------
//--------------------------File Serving---------------------------------
//-----------------------------------------------------------------------

app.get('/spacetrace', (response) => {
    response.sendFile(path.join(pth.join(__dirname, '/public/spacetrace/index.html')));
})

app.get('/', (request, response) => {
    if (DoesSessionExist(request.sessionID) === false) {
        const session = request.session;
        session.id = request.genid;
        session.userid = request.body.username;
        session.maxAge = oneDay;
        request.session = session;

        sessionArray.push(session);
    }
    response.sendFile(path.join(__dirname, '/public/html/Home.html'));
})

//Checks if a session is already present 
//returns a boolean value
function DoesSessionExist(sessionID) {
    for (let i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i].id == sessionID) {
            return true;
        }
    }
    return false;
}