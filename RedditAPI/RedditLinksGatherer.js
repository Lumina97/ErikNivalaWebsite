const axios = require("axios");
const querystring = require("querystring");
const log = require("../Config").log;

const oAuthURL = "https://oauth.reddit.com";
let Access_Token;

async function GetRedditPosts(subreddit, amount, titleFilters) {
  return new Promise(async function (resolve, reject) {
    log.info(
      "Getting " +
        amount +
        " reddit posts - LinksGatherer.js - GetRedditPosts()"
    );

    const params = querystring.stringify({
      limit: amount,
    });

    const urlink = oAuthURL + "/r/" + subreddit + "/new" + "?" + params;

    const config = {
      method: "get",
      url: urlink,
      headers: {
        Authorization: "BEARER " + Access_Token,
        "User-Agent":
          "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
      },
    };

    const response = await axios(config).catch((result) => {
      log.info(result);
      reject(false);
      return;
    });

    const postArray = response.data.data.children;
    log.info("response: " + response.status);
    if (typeof postArray === undefined || postArray.length == 0) {
      log.warn("Subreddit does not exist! - LinksGatherer.js");
      reject("Error: Subreddit does not exist!");
      return;
    }

    const image_links = [];
    let amountOfImages = 0;

    let bHasAnyImageLinks = false;
    for (post of postArray) {
      if (
        post.kind == "t3" &&
        (post.data.url.includes(".jpg") ||
          post.data.url.includes(".png") ||
          post.data.url.includes(".jpeg"))
      ) {
        if (FilterTitle(post.data.title, titleFilters) == false) {
          log.info("Title does not meet filter requirements!");
          continue;
        }

        image_links.push(post.data.url);
        log.info("URL: " + post.data.url);
        bHasAnyImageLinks = true;
        amountOfImages++;
      } else {
        log.info("Not an image post");
      }
    }

    if (bHasAnyImageLinks == false) {
      log.warn("No image links found! - LinksGatherer.js - GetRedditPosts()");
      reject("No images in specified search!");
      return;
    } else {
      log.info(
        "Found " +
          amountOfImages +
          " links! - LinksGatherer.js - GetRedditPosts()"
      );
      resolve(image_links);
    }
  });
}

// Iterates given title and checks if the given filters exist within the title
async function FilterTitle(Title, Filters) {
  for (let i = 0; i < Filters.length; i++) {
    log.info("TITLE: \t" + Title);
    log.info("Filter: \t" + Filters[i]);

    if (Title.includes(Filters[i])) {
      log.info("title contains filter!");
      return true;
    }
  }
  return false;
}

module.exports = {
  GetImageLinksFromSubreddit: async function (
    subreddit,
    amountOfPostsSearched,
    titleFilters,
    access_token
  ) {
    return new Promise(async function (resolve, reject) {
      Access_Token = access_token;

      // validate input
      if (typeof subreddit === "undefined") {
        log.warn(
          "Passed in subreddit was undefined! - DownloadImagesFromSubreddit() "
        );
        reject("Unable to find subreddit");
        return;
      }
      if (
        typeof amountOfPostsSearched === "undefined" ||
        isNaN(amountOfPostsSearched) == true ||
        typeof amountOfPostsSearched != "number"
      ) {
        log.info(
          "Defaulting search amount to 25 posts - DownloadImagesFromSubreddit()"
        );
        amountOfPostsSearched = 25;
      }

      //wait to get links
      await GetRedditPosts(subreddit, amountOfPostsSearched, titleFilters)
        .then((result) => {
          resolve(result);
          return;
        })
        .catch((err) => {
          if (err) console.log("Error Getting image links: " + err);
          reject(err);
          return;
        });
    });
  },
};
