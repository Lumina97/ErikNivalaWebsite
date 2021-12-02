const RedditLinksGatherer = require('./RedditLinksGatherer');
const SubValidator = require('./SubredditValidator');
const FileDownloader = require('./../FileDownloader');
const FileZipper = require('./../FileZipper');


module.exports =
{
  DownloadImagesFromSubreddit: async function (subreddit, amount, userID) {

    return new Promise(async function (resolve, reject) {

      console.log();
      console.log('===============================================');
      console.log('==========DownloadImagesFromSubreddit==========');
      console.log('===============================================');
      console.log();

      let image_links = [];
      SubRedditToScan = subreddit;
      AmountOfPosts = parseInt(amount);
      let ID = userID;

      await SubValidator.ValidateSubreddit(subreddit)
        .then(async function () {
          image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit, AmountOfPosts);
          return;
        })
        .then(async function () {
          return await FileDownloader.DownloadFilesFromLinks(image_links, ID);
        })
        .then(async function () {
          return await FileZipper.CreateZipFromUserID(ID);
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