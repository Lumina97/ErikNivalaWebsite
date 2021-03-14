const Datastore = require('nedb');
const express = require('express');
const RedditAPI = require('./RedditAPI');

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

app.listen(3000, () => console.log("Listening at 3000"));

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));


app.post('/ImageLoader', async function (request, response) {
    const data = request.body;
    console.log("ImageLoader Request: " + JSON.stringify(data));

    await RedditAPI.DownloadImagesFromSubreddit(data.subreddit, data.amount)
    .catch(() => {
        console.log("ERROR There was an error getting your data!");
        response.json({ "ERROR": "There was an error getting your data!" })
        return;
    })
    .then(()=>{
        console.log("SUCESS Fulfilled request!");
        response.json({ "SUCESS": "Fulfilled request!" });
        return;
    }).catch(() => {
        console.log("Error occured during call to Imageloader!");
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