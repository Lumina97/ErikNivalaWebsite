const express = require('express');
const RedditAPI = require('./RedditAPI/RedditAPI');
const LogInManager = require('./LogIn/LogInManager');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const session = require('express-session');
const compression = require('compression');


const app = express();

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb' }));

const oneDay = 1000 * 60 * 60 * 24;
const secretKey = uuidv4();
var sessionArray = new Array();
var downloadRequestDict = {};

app.use(session({
    name: 'SessionCookie',
    genid: function (req) {
        console.log('session id created');
        return uuidv4();
    },
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: oneDay }
}));

app.listen(3000, () => console.log("listening on 3000")).on('error', console.log);

//-----------------------------------------------------------------------
//--------------------------Image Gatherer-------------------------------
//-----------------------------------------------------------------------

app.post('/download', async function (request, response) {
    console.log('Download POST request');

    if (DoesSessionExist(request.sessionID) === false) {
        console.log("Seesion ID was invalid - Download request");
        response({ "Error": "There was an error with your download request!" });
        return;
    }

    console.log(request.body);
    const path = request.body.path;
    downloadRequestDict[request.sessionID] = path;
    console.log(downloadRequestDict);

    var data;
    try {
        data = JSON.stringify("Sucess");
        response.json(data);
    }
    catch (e) {
        console.log('ERROR:\n' + e);
    }
});

app.get('/download', async function (request, response) {
    console.log('Download GET request');

    for (const [key, value] of Object.entries(downloadRequestDict)) {
        console.log(key, value);
        if (key == request.sessionID) {
            console.log('Found request!');
            const path = value;
            console.log(path);
            response.download(path);
            delete downloadRequestDict[key];
        }
    }
})

app.post('/ImageLoader', async function (request, response) {

    if (DoesSessionExist(request.session.id) === false) {
        console.log('Invalid Session!');
        response.json({ "ERROR": "Invalid Session, try reloading the page!" });
        return;
    }

    const data = request.body;

    if (data.subreddit == false) {
        console.log("Subreddit was empty!");
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
                console.log('Error parsing json! \n' + error);
                response.json('There was an error getting your data!');
                return;
            }
        })
        .catch((error) => {
            console.log("ERROR: " + error);
            response.json({ "ERROR": "There was an error getting your data!" });
            return;
        });
})

//-----------------------------------------------------------------------
//--------------------------File Serving---------------------------------
//-----------------------------------------------------------------------

app.get('/spacetrace', (request, response) => {
    console.log("SPACE TRACE!!");
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