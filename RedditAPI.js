const RedditLinksGatherer = require('./RedditLinksGatherer');
const FileDownloader = require('./FileDownloader');


module.exports =
{
  DownloadImagesFromSubreddit: async function (subreddit, amount) {

    return new Promise(async function (resolve, reject) {

      let image_links = [];
      SubRedditToScan = subreddit;
      AmountOfPosts = parseInt(amount);

      image_links = await RedditLinksGatherer.GetImageLinksFromSubreddit(subreddit,amount)
      .catch(() => {
        console.log("There was an error Getting posts!");
        reject(false);
      });

      await FileDownloader.DownloadFilesFromLinks(image_links)
      .catch(() => {
        console.log("There was an error downloading images!");
        reject(false);
      })
      .then(() => {
        resolve(true);
      });

    })
  }
}