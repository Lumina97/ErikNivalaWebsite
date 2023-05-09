const RedditLinksGatherer = require('./RedditLinksGatherer');
const SubValidator = require('./SubredditValidator');
const FileDownloader = require('./../FileDownloader');
const FileZipper = require('./../FileZipper');
const path = require('path');


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

      await SubValidator.ValidateSubreddit(subreddit)
        .then(async function () {
          image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit, AmountOfPosts, postTitleFilters);
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
          console.log(new Error(err));
          reject(err);
          return;
        })


      // validation.then(async function () {
      //   image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit, AmountOfPosts)
      //     .catch(() => {
      //       console.log("There was an error Getting posts!");
      //       reject(false);
      //       return;
      //     });
      // })

      // image_links.then(async function () {
      //   const downloader = await FileDownloader.DownloadFilesFromLinks(image_links, ID)
      //     .catch(() => {
      //       console.log("There was an error downloading images!");
      //       reject(false);
      //       return;
      //     })
      // })

      // downloader.then(async function () {
      //   await FileZipper.CreateZipFromUserID(ID)
      //     .catch(() => {
      //       console.log("There was an error zipping images!");
      //       reject(false);
      //       return;
      //     })
      //     .then((result) => {
      //       resolve(result);
      //     });
      // })
    })
  }
}