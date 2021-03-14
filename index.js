const Datastore = require('nedb');
const express = require('express');
const RedditImageLoader = require('./RedditAPI');

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

// RedditImageLoader.DownloadImagesFromSubreddit('gonewild',50);

app.listen(3000, () => console.log("Listening at 3000"));

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));


app.post('/ImageLoader',(request, response) =>{
    console.log("Received get request: BODY: " +request.body);
    
    const data = request.body;
    RedditImageLoader.DownloadImagesFromSubreddit(data.subreddit,data.amount);
    response.json(data);
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