const RedditLinksGatherer = require('./RedditLinksGatherer');
const FileDownloader = require('./FileDownloader');
const FileZipper = require('./RedditAPIFileZipper');


module.exports =
{
  DownloadImagesFromSubreddit: async function (subreddit, amount, userID) {

    return new Promise(async function (resolve, reject) {

      console.log('=================================');
      console.log('===DownloadImagesFromSubreddit===');
      console.log('=================================');
      console.log();

      let image_links = [];
      SubRedditToScan = subreddit;
      AmountOfPosts = parseInt(amount);
      let ID = userID;

      image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit, AmountOfPosts)
        .catch(() => {
          console.log("There was an error Getting posts!");
          reject(false);
          return;
        });

      await FileDownloader.DownloadFilesFromLinks(image_links, ID)
        .catch(() => {
          console.log("There was an error downloading images!");
          reject(false);
          return;
        })

      await FileZipper.CreateZipFromUserID(ID)
        .catch(() => {
          console.log("There was an error zipping images!");
          reject(false);
          return;
        })
        .then((result) => {
          resolve(result);
        });
    })
  }
}