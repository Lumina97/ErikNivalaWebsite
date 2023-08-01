const axios = require('axios');
const querystring = require('querystring');

const oAuthURL = "https://oauth.reddit.com"
let Access_Token;

async function GetRedditPosts(subreddit, amount, titleFilters) {

    return new Promise(async function (resolve, reject) {

        if (amount === 'undifined')
            amount = 25;

        console.log("Getting " + amount + " reddit posts - RedditAPI.js - GetRedditPosts()")

        const params = querystring.stringify({
            'limit': amount
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
                console.log("Error getting reddit posts! - RedditAPI.js - GetRedditPosts()")
                console.log(result);
                reject(false);
                return;
            });
        const postArray = response.data.data.children;

        console.log("respons: " + response.status);

        let image_links = [];
        let amountOfImages = 0;

        let bHasAnyImageLinks = false;
        for (post of postArray) {
            if ((post.kind == "t3" && (post.data.url.includes(".jpg")
                || post.data.url.includes(".png"))
            )) {
                if (FilterTitle(post.data.title, titleFilters) == false) {
                    console.log('Titel does not meet filter requirements!')
                    continue;
                }

                image_links.push(post.data.url);
                console.log("URL: " + post.data.url);
                bHasAnyImageLinks = true;
                amountOfImages++;
            }
            else {
                console.log("Not an image post");
            }
        }

        if (bHasAnyImageLinks == false) {
            console.log("No image links found! - RedditLinksGatherer.js - GetRedditPosts()")
            reject('No images in specified search!');
            return;
        }
        else {
            console.log("Found " + amountOfImages + " links! - RedditLinksGatherer.js - GetRedditPosts()")
            resolve(image_links);
        }
    });
}

// Iterates given title and checks if the given filters exist within the title
async function FilterTitle(Title, Filters) {
    for (let i = 0; i < Filters.length; i++) {
        console.log('TITLE: \t' + Title);
        console.log('Filter: \t' + Filters[i]);

        if (Title.includes(Filters[i])) {
            console.log('title containts filter!');
            return true;
        }
    }
    return false;
}

module.exports = {

    GetImageLinksFromSubreddit: async function (subreddit, amountOfPostsSearched, titleFilters, access_token) {

        return new Promise(async function (resolve, reject) {

            console.log();
            console.log('===============================================');
            console.log('=================GetRedditPosts================');
            console.log('===============================================');
            console.log();

            Access_Token = access_token;


            // validate input
            if (typeof subreddit === 'undefined') {
                console.log("Passed in subreddit was undefined! - DownloadImagesFromSubreddit() ")
                console.log();
                console.log('===============================================');
                console.log('=============END GetRedditPosts================');
                console.log('===============================================');
                console.log();
                reject("Unable to find subreddit");
                return;
            }
            if (typeof amountOfPostsSearched === 'undefined' || isNaN(amountOfPostsSearched) == true || typeof amountOfPostsSearched != "number") {
                console.log("Defaulting search amount to 25 posts - DownloadImagesFromSubreddit()")
                amountOfPostsSearched = 25;
            }

            //wait to get links
            await GetRedditPosts(subreddit, amountOfPostsSearched, titleFilters)
                .then((result) => {
                    console.log();
                    console.log('===============================================');
                    console.log('=============END GetRedditPosts================');
                    console.log('===============================================');
                    console.log();
                    resolve(result);
                    return;
                })
                .catch((err) => {
                    if (err) console.log("Error Getting image links: " + err);
                    console.log();
                    console.log('===============================================');
                    console.log('=============END GetRedditPosts================');
                    console.log('===============================================');
                    console.log();
                    reject(err);
                    return;
                });
        });
    }
}