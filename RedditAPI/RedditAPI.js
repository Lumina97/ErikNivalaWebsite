const RedditLinksGatherer = require('./RedditLinksGatherer');
const SubValidator = require('./SubredditValidator');
const FileDownloader = require('./../FileDownloader');
const FileZipper = require('./../FileZipper');
const path = require('path');
const RedditAuthentication = require('./RedditAuthentication');


module.exports =
{
  DownloadImagesFromSubreddit: async function (subreddit, amount, session, postTitleFilters) {

    return new Promise(async function (resolve, reject) {

      console.log();
      console.log('===============================================');
      console.log('==========DownloadImagesFromSubreddit==========');
      console.log('===============================================');
      console.log();

      if (session === undefined) {
        reject("Session was invalid");
        return;
      }

      let image_links = [];
      SubRedditToScan = subreddit;
      AmountOfPosts = parseInt(amount);
      var today = new Date();
      var date = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
      const ID = path.join(String(session.userid), String(date));
      var access_token;

      await RedditAuthentication.GetAutheticationToken()
        .then((result) => {
          access_token = result;
        })
        .catch(() => {
          reject("Failed to get access token - RedditAPI.");
          return;
        });


      await SubValidator.ValidateSubreddit(subreddit, access_token)
        .then(async function () {
          image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit, AmountOfPosts, postTitleFilters, access_token);
          return;
        })
        .then(async function () {
          return await FileDownloader.DownloadFilesFromLinks(image_links, ID);
        })
        .then(async function (result) {
          return await FileZipper.CreateZipFromUserID(result);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log("There was an error while gathering subreddit images! ");
          console.log(err);
          reject(err);
          return;
        })
    })
  }
}