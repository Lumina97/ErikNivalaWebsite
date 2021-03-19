const Datastore = require('nedb');
const express = require('express');
const RedditAPI = require('./RedditAPI');
const mime = require('mime-types');
const fs = require('fs');

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

app.listen(3000, () => console.log("listening on 3000")).on('error', console.log);

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));

let userID = 0;

app.post('/ImageLoader', async function (request, response) {
    const data = request.body;
    console.log("ImageLoader Request: " + JSON.stringify(data));
    userID++;

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount, userID)
        //Reddit Error handling 
        .catch(() => {
            console.log("ERROR There was an error getting your data!");
            response.json({ "ERROR": "There was an error getting your data!" })
            return;
        })
        .then((result) => {
            console.log("SUCESS Fulfilled request!");
            response.json({ path : result });
            return;

            // var stats = fs.statSync(result)
            // var fileSizeInBytes = stats.size;
            // var mimetype = mime.lookup(result);

            // console.log('size: ' + fileSizeInBytes);

            // response.setHeader('Content-Length', fileSizeInBytes);
            // response.setHeader('Content-Type', mimetype);
            // response.setHeader('Content-Disposition', 'attachment; filename=' + result);   

            // response.download(result, (err) => { console.log(err) });

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