const axios = require('axios');
const querystring = require('querystring');
const RedditAuthentication = require('./RedditAuthentication');

const oAuthURL = "https://oauth.reddit.com"
let Access_Token;

async function ValidateSubReddit(subreddit) {

    return new Promise(async function (resolve, reject) {

        const params = querystring.stringify({
            'limit': 1
        })

        let urlink = oAuthURL + "/r/" + subreddit + "/hot" + "?" + params;

        const config = {
            method: 'get',
            url: urlink,
            headers: {
                "Authorization": "BEARER " + Access_Token,
                'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1'
            }
        }

        const response = await axios(config)
            .catch((result) => {
                console.log("Error getting subreddit! - SubredditValidator.js - ValidateSubReddit() - 29")
                console.log(result.error);
                reject('Error getting axios response!');
                return;
            });

        try {

            const postArray = response.data.data.children;

            console.log(response.status);


            if (typeof postArray === undefined || postArray.length == 0) {
                console.log("Subreddit does not exist! - SubredditValidator.js - ValidateSubReddit() - 40");

                reject('Error: Subreddit does not exist!');
                return;
            }
            else {
                resolve("Subreddit does exist! - SubredditValidator.js - ValidateSubReddit()");
                return;
            }
        }
        catch {
            reject('There was an issue Getting response data');
            return;
        }
    });
}



module.exports = {

    ValidateSubreddit: async function (subreddit, access_token) {

        return new Promise(async function (resolve, reject) {

            console.log();
            console.log('===============================================');
            console.log('================ValidateSubreddit==============');
            console.log('===============================================');
            console.log();

            Access_Token = access_token;

            // validate input
            if (typeof subreddit === 'undefined') {
                console.log("Passed in subreddit was undefined! - ValidateSubreddit()  ")
                console.log();
                console.log('===============================================');
                console.log('============END ValidateSubreddit==============');
                console.log('===============================================');
                console.log();
                return reject('Error: Subreddit was not defined!');
            }

            //wait to get links
            await ValidateSubReddit(subreddit)
                .then((result) => {
                    console.log("Subreddit does exist! - 107 : " + result);
                    console.log();
                    console.log('===============================================');
                    console.log('============END ValidateSubreddit==============');
                    console.log('===============================================');
                    console.log();
                    return resolve(result);
                })
                .catch((err) => {
                    if (err) console.error(err);
                    console.log();
                    console.log('===============================================');
                    console.log('============END ValidateSubreddit==============');
                    console.log('===============================================');
                    console.log();
                    reject('Error: Subreddit does not exist!');
                    return;
                })

        });
    }
}