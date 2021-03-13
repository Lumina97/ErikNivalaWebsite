const Datastore = require('nedb');
const express = require('express');

const app = express();
const database = new Datastore('database.db');
database.loadDatabase();

app.listen(3000, () => console.log("Listening at 3000"));

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }));


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