const Datastore = require('nedb');
const express = require('express');
const cookieParser = require('cookie-parser');
const RedditAPI = require('./RedditAPI/RedditAPI');
const LogInManager = require('./LogIn/LogInManager')
const { v4: uuidv4 } = require('uuid');
const sessions = require('express-session');
const { application, request, response } = require('express');

const app = express();

const database = new Datastore('database.db');
database.loadDatabase();


app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());


const oneDay = 1000 * 60 * 60 * 24;
const secretKey = uuidv4();
var session;

app.use(sessions({
    name: 'SessionCookie',
    // genid: function (req) {
    //     console.log('session id created');
    //     return uuidv4();
    // },
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: oneDay }
}));

app.listen(3000, () => console.log("listening on 3000")).on('error', console.log);

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
    console.log(" Log In request with Username: " + data.username + " and password: " + data.password);
    await LogInManager.ValidateLogInInformation(data.username, data.password)
        .then((result) => {
            if (result) {

                session=request.session;
                session.userid=request.body.username;
                console.log(request.session)   
                console.log("Finished Log in process: -index.js\t " + result);

                const URL = 'http://localhost:3000/index.html'
                console.log('Redicreting to ' + URL);
                response.redirect(URL);
                return;
            }
        })
        .catch((err) => {
            if (err) {
                console.log("There has been an error with the log in process. - Index.js \n" + err);
                response.json(JSON.stringify("There has been an error with the log in process."));
                return;
            }
        })
})

app.get('/LogOut', (request,response) => {
    request.session.destroy();
    console.log('Deleted seesion and redirection user to main page - logout')
    response.redirect('/');
})

app.post('/download', (request, response) => {
    console.log(request.body.path);
    response.download(request.body.path);
});

app.post('/ImageLoader', async function (request, response) {
    const data = request.body;
    console.log("ImageLoader Request: " + JSON.stringify(data));

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount)
        .catch(() => {
            console.log("ERROR There was an error getting your data!");
            response.json({ "ERROR": "There was an error getting your data!" })
            return;
        })
        .then((result) => {
            console.log("SUCESS Fulfilled request!");
            response.json({ path: result }); //.then(() => {
            //         return;
            // })
            // .catch((err) =>
            // {
            //     console.log("Error Creating a response json! err: \n"+err);
            //     return;
            // });
            return;

            // var stats = fs.statSync(result)
            // var fileSizeInBytes = stats.size;
            // var mimetype = mime.lookup(result);

            // console.log('size: ' + fileSizeInBytes);

            // response.setHeader('Content-Length', fileSizeInBytes);
            // response.setHeader('Content-Type', mimetype);
            // response.setHeader('Content-Disposition', 'attachment; filename=' + result);   

            // response.download(result, (err) => { console.log(err) });

        });
    // Set disposition and send it.
    // //Post Request Error handling
    // .catch((err) => {
    //     console.log("Error occured during call to Imageloader! - index.js - ImageLoader Request()");
    //     console.log(err);
    //     return;
    // });
})






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