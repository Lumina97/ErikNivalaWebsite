const axios = require('axios').default;
const fs = require('fs');
const https = require('https');
const http = require('http');

const querystring = require('querystring');
const oAuthURL = "https://oauth.reddit.com"

let Refresh_Token;
let Acess_Token;
let image_links = [];
let SubRedditToScan;
let AmountOfPosts;

//===================AUTHORIZATION=========================
async function MakeAuthenticationRequest(successCallback, errorCallback) {


  successCallback(obj = {
    access_token: '456556608586-8ElYRalY2Wn3EREUW-58Z9601W0meA',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: '456556608586-ScaQ_Po6r3spMPpd1apJrleWIczElA',
    scope: 'edit flair history identity modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread'
  });
  return;



  const payload = querystring.stringify({
    grant_type: 'authorization_code',
    code: "SK5eGy2lDgUePxEjCnYOOmalx0uzOQ",
    redirect_uri: 'https://www.eriknivala.com'
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
  console.log(response.status);
  console.log(res_Data);

  if (res_Data.error) {
    errorCallback("Unable to receive Bearer token: " + res_Data.error);
  }
  else {
    successCallback(res_Data);
  }
}

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
  console.log(response.status);
  console.log(res_Data);

  if (res_Data.error) {
    errorCallback("Unable to receive Bearer token: " + res_Data.error);
  }
  else {
    successCallback(res_Data);
  }
}

function AuthRequestPromise() {
  return new Promise((resolve, reject) => {
    MakeAuthenticationRequest((successCallback) => {
      resolve(successCallback);
    },
      (errorCallback) => {
        reject(errorCallback);
      });
  })
}

function AuthRefreshTokenPromise() {
  return new Promise((resolve, reject) => {
    RefreshAcessToken(Refresh_Token, (successCallback) => {
      resolve(successCallback);
    },
      (errorCallback) => {
        reject(errorCallback);
      });
  })
}

async function RefreshToken() {

  try {
    const x = await ReadTokenFile();

    if (typeof Acess_Token !== 'undefined') {
      console.log("have no acess token");
      const refreshTokenResponse = await AuthRefreshTokenPromise();
      console.log(refreshTokenResponse);
      fs.writeFile("Tokens", JSON.stringify(refreshTokenResponse), function (error) {
        if (error) return console.log(error);
      });
    }
    else {
      console.log("have no acess token");

      const authResponse = await AuthRequestPromise();
      console.log(authResponse);

      Refresh_Token = authResponse.refresh_token;
      Acess_Token = authResponse.access_token;
      fs.writeFile("Tokens", JSON.stringify(authResponse), function (error) {
        if (error) return console.log(error);
      });
    }
  }
  catch (error) {
    // handle getting accesscode etc 
    console.log(error);
  }
}

async function ReadTokenFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("Tokens", 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      if (data.length > 0) {
        const obj = JSON.parse(data);

        Refresh_Token = obj.refresh_token;
        Acess_Token = obj.access_token;
        resolve("Loaded Acess Tokens");
      }
      else
        resolve("Issue reading file");

    });
  })
}

//========================GET REQUESTS=================================


async function GetMe(amount) {

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

  const response = await axios(config);
  const postArray = response.data.data.children;

  console.log(response.status);


  for (post of postArray) {
    if (post.kind == "t3" && (post.data.url.includes(".jpg")
      || post.data.url.includes(".png")
      || post.data.url.includes("gallery")
      || post.data.url.includes(".gifv"))) {
      image_links.push(post.data.url);
      console.log("URL: " + post.data.url);
    }
    else {
      console.log("Not an image post");
    }
  }

  fs.writeFile("Links", JSON.stringify(image_links), function (error) {
    if (error) return console.log(error);
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
        await DownloadHTTPSFile(image_links[i]);
      }
      else if (image_links[i].includes('http')) {
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
  const baseDest = "/home/erik/DEV/Images/" + SubRedditToScan;
  const fileLocationarray = link.split("/");
  const fileLocation = fileLocationarray[fileLocationarray.length - 1];

  let dest = baseDest + "/" + fileLocation;
  const filestream = fs.createWriteStream(dest);

  if (fs.existsSync(baseDest) == false) {
    fs.mkdirSync(baseDest);
    console.log("Created directory: " + baseDest);
  }

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
  DownloadImagesFromSubreddit: async function (subreddit, postsToCheck) {
    //Reset the links so we don't redownload images from other requests
    image_links = [];
    
    SubRedditToScan = subreddit;
    AmountOfPosts = postsToCheck;
    await RefreshToken();
    await GetMe(AmountOfPosts);
    await DownloadFilesFromLinks();
  }
}