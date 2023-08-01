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
//----------------------Account Management-------------------------------
//-----------------------------------------------------------------------

app.post('/CreateAccount', async function (request, response) {
    const data = request.body;
    console.log("Account Creation request with Username: " + data.username + " and password: " + data.password);
    await LogInManager.CreateNewAccount(data.username, data.password)
        .then((result) => {
            if (result) {

                CreatedAccountDict[request.session.id] = JSON.stringify({ 'username': data.username, 'password': data.password });
                console.log("Created account! \t" + result);
                response.redirect('/CreatedAccountLogin');
                return;
            }
        })
        .catch((err) => {
            if (err) {
                console.log("Error creating account! index.js\n" + err);
                response.json(JSON.stringify(err));
                return;
            }
        })
})

async function LogIn(username, password, request) {
    return new Promise((async function (resolve, reject) {
        await LogInManager.ValidateLogInInformation(username, password)
            .then((result) => {
                if (result) {
                    session = request.session;
                    session.id = request.genid;
                    session.userid = request.body.username;
                    request.session = session;

                    console.log('Request session: ');
                    console.log(request.session);
                    console.log(request.session.id);
                    console.log('Session: ');
                    console.log(session);
                    console.log(session.id);

                    // console.log('Session ID: ' + request.session.id);
                    console.log("Finished Log in process: -index.js");

                    console.log('Redicreting to /ImageGatherer ');
                    resolve('/ImageGatherer');
                    return;
                }
            })
            .catch((err) => {
                if (err) {
                    console.log("There has been an error with the log in process. - Index.js \n" + err);
                    reject(JSON.stringify(err));
                    return;
                }
            })
    }));
}

app.get('/CreatedAccountLogin', async function (request, response) {
    var data;
    var foundData = false;
    for (const [key, value] of Object.entries(CreatedAccountDict)) {
        console.log(key, value);
        if (key == request.sessions.id) {
            console.log('Found account creation request!');
            data = JSON.parse(value);
            delete CreatedAccountDict[key];
            foundData = true;
        }
    }
    if (foundData == false) {
        console.log('No account creation data was found!');
        response.json(JSON.stringify({ 'ERROR': 'Error Redirecting after account creation. Try logging in.' }));
        return;
    }

    await LogIn(data.username, data.password, request)
        .then((result) => {
            response.redirect(result);
        })
        .catch((error) => {
            response.json(error);
        })
})

app.post('/LogIn', async function (request, response) {

    const data = request.body;
    console.log("Log In request with Username: " + data.username + " and password: " + data.password);
    await LogIn(data.username, data.password, request)
        .then((result) => {
            response.redirect(result);
        })
        .catch((error) => {
            response.json(error);
        })
})

app.get('/LogOut', (request, response) => {
    request.session.destroy();
    console.log('Deleted seesion and redirection user to main page - logout')
    response.redirect('/');
})


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
    console.log("ImageLoader Request: " + JSON.stringify(data));

    if (data.subreddit == false) {
        console.log("Subreddit was empty!");
        response.json({ "ERROR": "Subreddit was empty!" });
        return;
    }

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount, session, data.filters)
        .then((result) => {
            console.log("SUCESS Fulfilled request!");
            var returnData;
            try {
                returnData = JSON.stringify({ 'path': result });
                response.json(returnData);

            }
            catch (error) {
                console.log('Error parsing json! \n' + error);
                response.json('There was an error getting your data!');
                return;
            }

            return;
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