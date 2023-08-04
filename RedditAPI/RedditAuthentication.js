const axios = require('axios').default;
const fs = require('fs');

const querystring = require('querystring');
const path = require('path');

const tokenPath = path.join(__dirname, "..", "Tokens");

let LastTokenRefreshTime;
let Refresh_Token;
let Acess_Token;

async function RefreshAcessToken() {
  return new Promise(async function (resolve, reject) {

    const payload = querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: Refresh_Token,
    })

    const response = await axios.post('https://www.reddit.com/api/v1/access_token', payload,
      {
        headers: {
          "Authorization": "Basic " + Buffer.from('ZHmLbNUoaVSVdw' + ":" + "W0bNZeU8oYaUxCzqcWuf89JLMnqMVg", "utf8").toString("base64"),
          'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': payload.length
        }
      }).catch((err) => {
        console.log("Error requesting access token:\n" + err);
        reject(false);
        return;
      });

    try {

      const res_Data = response.data;

      if (res_Data.error) {
        Console.log("Unable to receive Bearer token: " + res_Data.error)
        reject(false);
        return;
      }
      else {
        Refresh_Token = res_Data.refresh_token;
        Acess_Token = res_Data.access_token;
        LastTokenRefreshTime = Date.now()

        resolve(res_Data);
        return;
      }
    }
    catch {
    }
    reject(false);
  })
}


async function WriteTokensToFile(tokens) {
  fs.writeFile(tokenPath, JSON.stringify(tokens), function (error) {
    if (error) {
      console.log("Error writing refresh token to file! - RedditAPI.js - RefreshToken()");
      return;
    }
  })
}


async function RefreshToken() {
  return new Promise(async function (resolve, reject) {

    await ReadTokenFile()
      .then(async function () {

        await RefreshAcessToken()
          .then(function (result) {
            WriteTokensToFile(result);
            resolve(true);
            return;
          })
          .catch(() => {
            console.log("Could not Refresh Token! - RedditAPI.js - RefreshToken()");
            reject(false);
            return;
          });
      })
      .catch(async function () {
        //TODO: Be able to Get tokens from reddit instead of relying on tokens saved to a file
        console.log("No acess token - RedditAPI.js - RefreshToken() ");
        reject("No acess token");
      });
  })
}

function ReadTokenFile() {
  return new Promise(function (resolve, reject) {
    fs.readFile(tokenPath, 'utf8', function (err, data) {
      if (err) {
        console.log("There was an error reading the Token File! = ReadTokenFile()");
        console.log(err);
        reject(false);
        return;
      }
      if (data.length > 0) {
        const obj = JSON.parse(data);

        Refresh_Token = obj.refresh_token;
        Acess_Token = obj.access_token;
        resolve(true);
        return;
      }
      else {
        console.log("Issue reading file  - RedditAPI.js - ReadTokenFile()");
        reject(false);
        return;
      }
    });
  })
}

async function GetToken() {
  return new Promise(async function (resolve, reject) {

    if (typeof Acess_Token === 'undefined' || CheckAcessTokenTimeLimitReached()) {
      await RefreshToken()
        .then(() => {
          resolve(Acess_Token);
          return;
        })
        .catch(() => {
          console.log("There was an error refreshing the token! - RedditAuthentication.js");
          reject(false);
          return;
        });
    }
    else {
      resolve(Acess_Token);
      return;
    }
  })
}

function CheckAcessTokenTimeLimitReached() {
  if (typeof LastTokenRefreshTime === 'undefined') {
    console.log("last token time is undefined! -  CheckAcessTokenTimeLimitReached()");
    return false;
  }

  let timePassed = Date.now() - LastTokenRefreshTime;
  let tokenTime = new Date(LastTokenRefreshTime);
  tokenTime.setHours(tokenTime.getHours() + 1);

  if (timePassed > tokenTime) {
    console.log('new token required!');
    return true;
  }
  else {
    console.log('token is still viable!');
    return false;
  }
}


module.exports =
{
  GetAutheticationToken: async function () {

    return new Promise(async function (resolve, reject) {

      await GetToken()
        .then((result) => {
          console.log("Sucesfully retrieved acess token!");
          resolve(result);
        })
        .catch(() => {
          console.log("There was an error refreshing the token! - RedditAuthentication.js");
          reject(false);
        });
    })
  }
}