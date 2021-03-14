const axios = require('axios').default;
const fs = require('fs');
const https = require('https');
const http = require('http');

const querystring = require('querystring');
const oAuthURL = "https://oauth.reddit.com"


async function MakeAuthenticationRequest(successCallback, errorCallback) {
  const data = {
    access_token: '456556608586-8ElYRalY2Wn3EREUW-58Z9601W0meA',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: '456556608586-ScaQ_Po6r3spMPpd1apJrleWIczElA',
    scope: 'edit flair history identity modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread'
  };

  console.log("Received Auth Request. - RedditAPI.js -MakeAuthenticationRequest()")
  successCallback(data);


  // const payload = querystring.stringify({
  //   grant_type: 'authorization_code',
  //   code: "SK5eGy2lDgUePxEjCnYOOmalx0uzOQ",
  //   redirect_uri: 'https://www.eriknivala.com'
  // })

  // const response = await axios.post('https://www.reddit.com/api/v1/access_token', payload, {
  //   headers: {
  //     "Authorization": "Basic " + Buffer.from('ZHmLbNUoaVSVdw' + ":" + "W0bNZeU8oYaUxCzqcWuf89JLMnqMVg", "utf8").toString("base64"),
  //     'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Content-Length': payload.length
  //   }
  // });

  // const res_Data = response.data;
  // console.log(response.status);
  // console.log(res_Data);

  // if (res_Data.error) {
  //   console.log("Unable to receive Bearer token: " + res_Data.error);
  //   errorCallback(false);
  // }
  // else {
  //   successCallback(res_Data);
  // }
}




//===================AUTHORIZATION=========================


async function RefreshAcessToken(refreshtoken, successCallback, errorCallback) {

  const payload = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshtoken,
  })

  const response = await axios.post('https://www.reddit.com/api/v1/access_token', payload, {
    headers: {
      "Authorization": "Basic " + Buffer.from('ZHmLbNUoaVSVdw' + ":" + "W0bNZeU8oYaUxCzqcWuf89JLMnqMVg", "utf8").toString("base64"),
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': payload.length
    }
  });

  const res_Data = response.data;

  if (res_Data.error) {
    Console.log("Unable to receive Bearer token: " + res_Data.error)
    errorCallback(false);
  }
  else {

    Refresh_Token = res_Data.refresh_token;
    Acess_Token = res_Data.access_token;

    successCallback(res_Data);
  }
}

function AuthRequestPromise() {
  return new Promise((resolve, reject) => {
    MakeAuthenticationRequest((successCallback) => {
      console.log("AuthRequestPromise - resolve");
      resolve(successCallback);
    },
      (errorCallback) => {
        console.log("AuthRequestPromise - reject");
        reject(errorCallback);
      });
  })
}

function AuthRefreshTokenPromise() {
  return new Promise((resolve, reject) => {
    RefreshAcessToken(Refresh_Token, (successCallback) => {
      console.log("AuthRefreshTokenPromise - resolve");
      resolve(successCallback);
    },
      (errorCallback) => {
        console.log("AuthRefreshTokenPromise - reject");
        reject(errorCallback);
      });
  })
}

async function RefreshTokenPromise() {
  return new Promise((resolve, reject) => {
    RefreshToken((sucessCallback) => {
      resolve(sucessCallback);
    },
      (errorCallback) => {
        reject(errorCallback);
      })
  })
}

async function RefreshToken(sucessCallback, erroCallback) {

  try {
    console.log("Reading Token File. - RedditAPI.js - RefreshToken()");
    await ReadTokenFile()
      .then(async function () {
        //==================================Get refresh token 
        console.log("Starting AuthRefreshTokenPromise(). - RedditAPI.js - RefreshToken()");
        await AuthRefreshTokenPromise()
          .catch(() => {
            //refresh token fail
            console.log("Could not Refresh Token! - RedditAPI.js - RefreshToken()");
            erroCallback(false);
          })
          .then(function (result) {
            //Refresh token sucess 
            fs.writeFile("Tokens", JSON.stringify(result), function (error) {
              if (error) {
                console.log("Error writing refresh token to file! - RedditAPI.js - RefreshToken()");
                erroCallback(false)
              }
            });
            console.log("Sucessfully refreshed token - RedditAPI.js - RefreshToken()");
            sucessCallback(true);
          });
        //================================== 

      })
      .catch(async function () {
        //================================ Read token file FAIL

        //==================================GET AUTH TOKEN
        console.log("No acess token - Getting Auth response - RedditAPI.js - RefreshToken() ");

        await AuthRequestPromise()
          .catch(() => {
            console.log("Error receiving auth response. RedditAPI.js - RefreshToken()");
            erroCallback(false);
          })
          .then(async function (result) {
            fs.writeFile("Tokens", JSON.stringify(result), function (error) {
              if (error) return console.log(error);
            });
            console.log("Received valid AUTH response. RedditAPI.js - RefreshToken()");
            await RefreshTokenPromise();
          });

      });
  }
  catch (error) {
    // handle getting accesscode etc 
    console.log(error);
    erroCallback(false);
  }
}

async function ReadTokenFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("Tokens", 'utf8', function (err, data) {
      if (err) {
        debug.log(err);
        reject(false);
      }
      if (data.length > 0) {
        const obj = JSON.parse(data);

        Refresh_Token = obj.refresh_token;
        Acess_Token = obj.access_token;
        console.log('Loaded Acess Tokens - RedditAPI.js - ReadTokenFile()');
        console.log("File refresh token: " + Refresh_Token);
        resolve(true);
      }
      else {
        console.log("Issue reading file  - RedditAPI.js - ReadTokenFile()");
        reject(false);
      }
    });
  })
}

//========================GET REQUESTS=================================


async function GetRedditPosts(amount) {

  return new Promise(async function (resolve, reject) {

    console.log("Getting reddit posts - RedditAPI.js - GetRedditPosts()")
    if (amount === 'undifined')
      amount = 25;

    const params = querystring.stringify({
      'limit': amount
    })

    let urlink = oAuthURL + "/r/" + SubRedditToScan + "/hot" + "?" + params;

    const config = {
      method: 'get',
      url: urlink,
      headers: {
        "Authorization": "BEARER " + Acess_Token,
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

    console.log(response.status);

    let bHasAnyImageLinks = false;
    for (post of postArray) {
      if (post.kind == "t3" && (post.data.url.includes(".jpg")
        || post.data.url.includes(".png")
        || post.data.url.includes("gallery")
        || post.data.url.includes(".gifv"))) {
        image_links.push(post.data.url);
        console.log("URL: " + post.data.url);
        bHasAnyImageLinks = true;
      }
      else {
        console.log("Not an image post");
      }
    }

    if (bHasAnyImageLinks == false) {
      console.log("No image links found! - RedditAPI.js - GetRedditPosts()")
      reject(false);
    }
    else {
      console.log("image links found! - RedditAPI.js - GetRedditPosts()")
      resolve(true);
    }

    // fs.writeFile("Links", JSON.stringify(image_links), function (error) {
    //   if (error)
    //   {
    //     Console.log()
    //     return console.log(error);
    //   } 
    // });
  });
}


//=====================FILE DOWNLOAD======================

async function DownloadFilesFromLinks() {
  if (typeof image_links !== 'undefined') {

    console.log("have image links");
    console.log("Starting download...");

    //======================DOWNLOAD FILE
    for (i = 0; i < image_links.length; i++) {
      if (image_links[i].includes('https')) {
        console.log("Starting HTTPS Download...");
        await DownloadHTTPSFile(image_links[i]);
      }
      else if (image_links[i].includes('http')) {
        console.log("Starting HTTP Download...");
        await DownloadHTTPFile(image_links[i]);
      }
    }
  }
  //======================IF NO FILE
  // else { //dont have image links
  //   console.log("have no Image Links");
  //   //try loading from file
  //   await LoadLinksFromFile();

  //   //verify 
  //   if (typeof image_links === 'undefined') {
  //     //return out of the function because we could not load images
  //     console.log("Could not retrieve image links to download");
  //     return;
  //   }
  //   //try downloading again
  //   else {
  //     await DownloadFilesFromLinks();
  //   }
  // }
}

async function DownloadHTTPSFile(link) {

  console.log("HTTPS DOWNLOAD: " + link);
  const baseDest = "/home/erik/DEV/Images/" + SubRedditToScan;
  const fileLocationarray = link.split("/");
  const fileLocation = fileLocationarray[fileLocationarray.length - 1];
  console.log("file location: " + fileLocation);

  console.log("Checking file directory...");

  if (fs.existsSync(baseDest) == false) {
    fs.mkdirSync(baseDest);
    console.log("Created directory: " + baseDest);
  }

  console.log("Creating destination and filestream...")
  let dest = baseDest + "/" + fileLocation;
  const filestream = fs.createWriteStream(dest);



  const req = https.get(link, function (res) {
    res.pipe(filestream);

    //handle filestream write errors
    filestream.on("error", function (error) {
      console.log("Error downloading file");
      console.log(error);

    })

    // done downloading
    filestream.on("finish", function () {
      filestream.close();
      console.log("Downloaded: " + fileLocation);
    })
  })
  //handle https download errors
  req.on("error", function (error) {
    console.log("Error downloading file");
    console.log(error);

  })

}

async function DownloadHTTPFile(link) {
  const baseDest = "/home/erik/DEV/Images/" + SubRedditToScan;
  const fileLocationarray = link.split("/");
  const fileLocation = fileLocationarray[fileLocationarray.length - 1];

  let dest = baseDest + "/" + fileLocation;

  if (fs.existsSync(baseDest) == false) {
    fs.mkdirSync(baseDest);
    console.log("Created directory: " + baseDest);
  }

  const req = http.get(link, function (res) {
    const filestream = fs.createWriteStream(dest);
    res.pipe(filestream);

    //handle filestream write errors
    filestream.on("error", function (error) {
      console.log("Error downloading file");
      console.log(error);

    })

    // done downloading
    filestream.on("finish", function () {
      filestream.close();
      console.log("Downloaded: " + fileLocation);
    })
  })
  //handle https download errors
  req.on("error", function (error) {
    console.log("Error downloading file");
    console.log(error);

  })
}


async function LoadLinksFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("Links", 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      if (data.length > 0) {
        image_links = JSON.parse(data);

        resolve("Loaded Image links");
      }
      else
        resolve("Issue reading file");
    });
  })
}

//==================== Function exports ==================


module.exports =
{
  DownloadImagesFromSubreddit: async function (subreddit, amount) {

    return new Promise(async function (resolve, reject) {

      image_links = [];
      SubRedditToScan = subreddit;
      AmountOfPosts = parseInt(amount);

      if (typeof SubRedditToScan === 'undefined') {
        console.log("Passed in subreddit was undefined! - DownloadImagesFromSubreddit() ")
        reject(false);
        return;
      }
      if (typeof AmountOfPosts === 'undefined' || isNaN(AmountOfPosts) == true || typeof AmountOfPosts != "number") {
        console.log("Amount of posts was either not an integer or undefined - Defaulting to 25 - DownloadImagesFromSubreddit()")
        AmountOfPosts = 25;
      }
      else {
        console.log("Amount of posts was an integer! Value: " + AmountOfPosts + " - DownloadImagesFromSubreddit()")
      }

      await RefreshTokenPromise().catch(() => {
        console.log("There was an error refreshing the token!");
        reject(false);
      });

      await GetRedditPosts(AmountOfPosts).catch(() => {
        console.log("There was an error Getting posts!");
        reject(false);
      });

      await DownloadFilesFromLinks().catch(() => {
        console.log("There was an error downloading images!");
        reject(false);
      }).then(() => {
        resolve(true);
      });

    })
  }
}