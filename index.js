const express = require('express');
const cookieParser = require('cookie-parser');
const RedditAPI = require('./RedditAPI/RedditAPI');
const LogInManager = require('./LogIn/LogInManager')
const { v4: uuidv4 } = require('uuid');
const sessions = require('express-session');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
const secretKey = uuidv4();
var session;
var downloadRequestDict = {};

app.use(sessions({
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
                console.log("Created account! \t" + result);
                response.json(JSON.stringify("Sucess"));
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

app.post('/LogIn', async function (request, response) {
    const data = request.body;
    console.log("Log In request with Username: " + data.username + " and password: " + data.password);
    await LogInManager.ValidateLogInInformation(data.username, data.password)
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
                response.redirect('/ImageGatherer');
                return;
            }
        })
        .catch((err) => {
            if (err) {
                console.log("There has been an error with the log in process. - Index.js \n" + err);
                response.json(JSON.stringify(err));
                return;
            }
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

    console.log(request.body);
    const path = request.body.path;
    downloadRequestDict[request.session.id] = path;
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

 app.get('/download',  async function (request, response)  {
    console.log('Download GET request');

    for (const [key, value] of Object.entries(downloadRequestDict)) {
        console.log(key, value);
        if(key == request.session.id)
        {
            console.log('Found request!');
            const path = value;
            console.log(path);        
            response.download(path);
        }
      }
 })

app.post('/ImageLoader', async function (request, response) {

    const sessiondata = request.session;

    if (sessiondata != null && session != null && sessiondata.id == session.id) {

        const data = request.body;
        console.log("ImageLoader Request: " + JSON.stringify(data));

        await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount, session)
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
                }

                return;
            })
            .catch((error) => {
                console.log("ERROR: " + error);
                response.json({ "ERROR": "There was an error getting your data!" });
                return;
            });
    }
    else {
        console.log('Invalid Session!');
        response.redirect(302, '/');
    }
})



//-----------------------------------------------------------------------
//--------------------------File Serving---------------------------------
//-----------------------------------------------------------------------
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/LogIn.html'));
})

app.get('/ImageGatherer', (request, response) => {
    if (session != null && request.session.id == session.id) {
        console.log('ImageGatherer');
        response.sendFile(path.join(__dirname, '/public/ImageGatherer.html'));
    }
    else {
        console.log('Invalid Session!');
        response.redirect('/');
    }
});










//a get route for adding a cookie
/*app.get('/setcookie', (req, res) => {
    res.cookie(`Cookie token name`,`encrypted cookie string Value`,
    {
        secure: true,       //A secure attribute ensures that the browser
                            //will reject cookies unless the connection happens
                            //over HTTPS.

        httpOnly : false,   //HTTPonly ensures that a cookie is not accessible
                            // using the JavaScript code. This is the most
                            //crucial form of protection against
                            //cross-scripting attacks.

        sameSite: 'lax'     //By default, sameSite was initially set to
                            //none (sameSite = None). This allowed third
                            //parties to track users across sites.
                            //Currently, it is set to Lax (sameSite = Lax)
                            //meaning a cookie is only set when the domain
                            //in the URL of the browser matches the domain
                            //of the cookie, thus eliminating third party’s
                            //domains. sameSite can also be set to Strict
                            //(sameSite = Strict). This will restrict
                            //cross-site sharing even between different
                            //domains that the same publisher owns.
    });
    res.send('Cookie have been saved successfully');
});


app.get('/getcookie',(req,res)=> {
    console.log(req.cookies)
    res.send(req.cookies);
});

*/