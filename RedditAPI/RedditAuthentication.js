const axios = require('axios').default;
const fs = require('fs');

const querystring = require('querystring');
const path = require('path');

const tokenPath = __dirname + path.sep + ".." + path.sep + "Tokens";

let LastTokenRefreshTime;
let Refresh_Token = "456556608586-vNZXnEDbd8BYP887vkNXgq7Rsw6wOw";
let Acess_Token;// = "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNjkwOTAzMjMxLjM5MTAxMiwiaWF0IjoxNjkwODE2ODMxLjM5MTAxMiwianRpIjoiWHQtR19KbzA0Y2ZTM0dMcnJ5Rms5cEIyeHpYbjVRIiwiY2lkIjoiWkhtTGJOVW9hVlNWZHciLCJsaWQiOiJ0Ml81dHFtMGxzYSIsImFpZCI6InQyXzV0cW0wbHNhIiwibGNhIjoxNTgzMTI2NjQzNDkyLCJzY3AiOiJlSnhFalVFT2cwQUlSZV95MTl5bzZXSkcwSkk2WWdCdHZIMHphdE1kZkI3X1BmRFJ0d3ByZ2hCbEY5Q1p1QlFHb1JuM0RZUWIyUzA3MG83WXFndXpadlRIcmNiZ1d2dHB…jVodGNnYkctZWlmbEtyZWRmOWd0aHFPXzNLc3FUbUFjSkxJODBQUEw4QkFBRF9fOEhGUXhjIiwicmNpZCI6IldVamlra2hyZHBBdTc5YUpkWEtwaTJtdk04ZXl0QTBUX1RmejRHeXZXT0UiLCJmbG8iOjh9.HiRBXJwqosgKx29DERO7PEEWPWEm_up6OmSVFtQA2cNXtic4QOe5fpqS_nqRe1DaDO6msqqiFLSAZQvbWwZdDOaygwufZMWqA_fgFXFWhVyT7G1vzHpXX9QUL_I0DZZStVG5vB2oXYRKdYuE_TjJJZrasTc8UgboXObSzvNaJ_zXxu1xoAAadxuCixQO1k8yh-1VDz4rDQo8sFm_Az61vtbeSkKAH-uLdtoO-omLKuuT4Z_CZHRXUZToBPb3gTABiRPoOeVqb7ZrTZs89mwZb1o2d1sb34KDQeIAQ6ml3gTvVrwCwHda8PYhTXCv9OO7sTL0nFS7kCz3KtRuaN5VVQ";

//===================AUTHORIZATION=========================


function AuthRequestPromise() {
  return new Promise((resolve, reject) => {
    MakeAuthenticationRequest((successCallback) => {
      console.log("AuthRequestPromise - resolve");
      resolve(successCallback);
      return;
    },
      (errorCallback) => {
        console.log("AuthRequestPromise - reject");
        reject(errorCallback);
        return;
      });
  })
}

async function MakeAuthenticationRequest(successCallback, errorCallback) {
  /*  const data = {
      access_token: '456556608586-8ElYRalY2Wn3EREUW-58Z9601W0meA',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: '456556608586-ScaQ_Po6r3spMPpd1apJrleWIczElA',
      scope: '*'
    };
  */

  const data = querystring.stringify({
    grant_type: 'authorization_code',
    code: "zIInyRLTPNzSA1OFWIriK22HNTxmgA",
    redirect_uri: "https://www.eriknivala.com"
  })

  const response = await axios.post('https://www.reddit.com/api/v1/access_token', data,
    {
      headers: {
        "Authorization": "Basic " + Buffer.from('ZHmLbNUoaVSVdw' + ":" + "W0bNZeU8oYaUxCzqcWuf89JLMnqMVg", "utf8").toString("base64"),
        'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    });

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



    console.log("____________________TOKENS____________________");
    console.log("Refresh: ", Refresh_Token);
    console.log("Acces: ", Acess_Token);
    console.log("_____________________END______________________");

    console.log("Received Auth Request. - RedditAPI.js -MakeAuthenticationRequest()")
    successCallback(res_Data);
    return;
  }
}



async function RefreshAcessToken() {
  return new Promise(async function (resolve, reject) {

    const payload = querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: "456556608586-vNZXnEDbd8BYP887vkNXgq7Rsw6wOw",
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
        //==================================Get refresh token
        console.log("Starting AuthRefreshTokenPromise(). - RedditAPI.js - RefreshToken()");

        await RefreshAcessToken()
          .then(function (result) {
            //Refresh token sucess
            WriteTokensToFile(result);
            resolve(true);
            return;
          })
          .catch(() => {
            //refresh token fail
            console.log("Could not Refresh Token! - RedditAPI.js - RefreshToken()");
            reject(false);
            return;
          });
      })
      .catch(() => {
        //do nothing since we want to continue to try and solve the token issue
      });
  })
    .catch(async function () {
      //TODO: Be able to Get tokens from reddit instead of relying on tokens saved to a file
      console.log("No acess token - RedditAPI.js - RefreshToken() ");
      reject("No acess token");

      await AuthRequestPromise()
        .then(async function (result) {
          fs.writeFile("Tokens", JSON.stringify(result), function (error) {
            if (error) return console.log(error);
          });
          console.log("Received valid AUTH response. RedditAPI.js - RefreshToken()");
          await RefreshTokenPromise();
        })
        .catch(() => {
          console.log("Error receiving auth response. RedditAPI.js - RefreshToken()");
          reject(false);
          return;
        });
    });
}

async function ReadTokenFile() {
  return new Promise(async function (resolve, reject) {
    fs.readFile(tokenPath, 'utf8', function (err, data) {
      if (err) {
        console.log("There was an error reading the Token File! = ReadTokenFile()");
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

    if (typeof Acess_Token === 'undefined') {
      console.log('token is undefined');
      await RefreshToken()
        .then(() => {
          resolve(Acess_Token);
          return;
        })
        .catch(() => {
          console.log("There was an error refreshing the token! - RedditAuthentication.js - GetToken() ln 226");
          reject(false);
          return;
        });
      return;
    }

    await CheckAcessTokenTimeLimitReached()
      //time limit reached!
      .then(async function (err) {

        await RefreshTokenPromise()
          .then(() => {
            resolve(Acess_Token);
            return;
          })
          .catch(() => {
            console.log("There was an error refreshing the token! - RedditAuthentication.js - GetToken() ln 234");
            reject(false);
            return;
          });
      })
      //time limit not reached
      .catch(() => {
        resolve(Acess_Token);
        return;
      });
  })
}



async function CheckAcessTokenTimeLimitReached() {
  return new Promise(async function (resolve, reject) {
    if (typeof LastTokenRefreshTime === 'undefined') {
      console.log("last token time is undefined! -  CheckAcessTokenTimeLimitReached() - 257")
      resolve();
      return;
    }

    let timePassed = Date.now() - LastTokenRefreshTime;
    let tokenTime = new Date(LastTokenRefreshTime);
    tokenTime.setHours(tokenTime.getHours() + 1);
    console.log("timepassed: " + timePassed)
    console.log("tokenTime: " + tokenTime)

    if (timePassed > tokenTime) {
      console.log('new token required!');
      resolve();
      return;
    }
    else {
      console.log('token is still viable!');
      reject();
      return;
    }
  })
}


module.exports =
{
  GetAutheticationToken: async function () {

    return new Promise(async function (resolve, reject) {
      console.log();
      console.log('===============================================');
      console.log('=============GetAutheticationToken=============');
      console.log('===============================================');
      console.log();

      await GetToken()
        .then((result) => {
          console.log("Sucesfully retrieved acess token!");
          console.log();
          console.log('===============================================');
          console.log('=========END GetAutheticationToken=============');
          console.log('===============================================');
          console.log();
          resolve(result);
        })
        .catch(() => {
          console.log("There was an error refreshing the token! - RedditAuthentication.js");
          console.log();
          console.log('===============================================');
          console.log('=========END GetAutheticationToken=============');
          console.log('===============================================');
          console.log();
          reject(false);

        });
    })
  }
}