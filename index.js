const Datastore = require('nedb');
const express = require('express');
//const cookieParser = require('cookie-parser');
const RedditAPI = require('./RedditAPI/RedditAPI');
const LogInManager = require('./LogIn/LogInManager')
const mime = require('mime-types');
const fs = require('fs');

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

app.listen(3000, () => console.log("listening on 3000")).on('error', console.log);

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));
//app.use(cookieParser());

let userID = 0;

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


app.post('/CreateAccount', async function (request,response) {
    const data = request.body;
    console.log("Account Creation request with Username: " + data.username + " and password: " + data.password);
    await LogInManager.CreateNewAccount(data.username, data.password)
    .then((result) => {
        if(result)
        {
            console.log("Created account! \t" + result);
            response.json(JSON.stringify("Sucess"));
            return;
        }
    })
    .catch((err) => {
        if(err)
        {
            console.log("Error creating account! index.js\n"+err);
            response.json(JSON.stringify(err));
            return;
        }
    })
})

app.post('/LogIn', async function (request,response) {
    const data = request.body;
    console.log(" Log In request with Username: " + data.username + " and password: " + data.password);
    await LogInManager.ValidateLogInInformation(data.username, data.password)
    .then((result) => {
        if(result) 
        {
            console.log("Finished Log in process: " + result);
            response.json(JSON.stringify(result));
            return;
        }
    })
    .catch((err) => {
        if(err)
        {
            console.log("There has been an error with the log in process. - Index.js \n"+ err );
            response.json(JSON.stringify(err));
            return;
        }
    })
})

app.post('/ImageLoader', async function (request, response) {
    const data = request.body;
    console.log("ImageLoader Request: " + JSON.stringify(data));
    userID++;

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount, userID)
        .then((result) => {
            console.log("SUCESS Fulfilled request!");
            response.json({ path: result });
            return;

            // var stats = fs.statSync(result)
            // var fileSizeInBytes = stats.size;
            // var mimetype = mime.lookup(result);

            // console.log('size: ' + fileSizeInBytes);

            // response.setHeader('Content-Length', fileSizeInBytes);
            // response.setHeader('Content-Type', mimetype);
            // response.setHeader('Content-Disposition', 'attachment; filename=' + result);   

            // response.download(result, (err) => { console.log(err) });

        })
        .catch(() => {
            console.log("ERROR There was an error getting your data!");
            response.json({ "ERROR": "There was an error getting your data!" })
            return ;
        }) // Set disposition and send it.
        //Post Request Error handling
        .catch((err) => {
            console.log("Error occured during call to Imageloader! - index.js - ImageLoader Request()");
            console.log(err);
            return;
        });
})



app.post('/api', (request, response) => {
    const data = request.body;
    const time = Date.now();
    data.timestamp = time;
    database.insert(data);
    response.json(data);
});

app.get('/api', (request, response) => {
    database.find({}, (error, data) => {
        if (error) {
            response.end();
            return;
        }

        response.json(data);

    });
})