const axios = require('axios').default;
const fs = require('fs');

const querystring = require('querystring');


let LastTokenRefreshTime;
let Refresh_Token;
let Acess_Token;
//===================AUTHORIZATION=========================

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
  return;


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
    return;
  }
  else {

    Refresh_Token = res_Data.refresh_token;
    Acess_Token = res_Data.access_token;
    LastTokenRefreshTime = Date.now()

    successCallback(res_Data);
    return;
  }
}

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

function AuthRefreshTokenPromise() {
  return new Promise((resolve, reject) => {
    RefreshAcessToken(Refresh_Token, (successCallback) => {
      console.log("AuthRefreshTokenPromise - resolve");
      resolve(successCallback);
      return;
    },
      (errorCallback) => {
        console.log("AuthRefreshTokenPromise - reject");
        reject(errorCallback);
        return;
      });
  })
}

async function RefreshTokenPromise() {
  return new Promise((resolve, reject) => {
    RefreshToken((sucessCallback) => {
      resolve(sucessCallback);
      return;
    },
      (errorCallback) => {
        reject(errorCallback);
        return;
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
          .then(function (result) {
            //Refresh token sucess 
            fs.writeFile("Tokens", JSON.stringify(result), function (error) {
              if (error) {
                console.log("Error writing refresh token to file! - RedditAPI.js - RefreshToken()");
                erroCallback(false)
                return;
              }
            });

            console.log("Sucessfully refreshed token - RedditAPI.js - RefreshToken()");
            sucessCallback(true);
            return;
          }) 
           .catch(() => {
            //refresh token fail
            console.log("Could not Refresh Token! - RedditAPI.js - RefreshToken()");
            erroCallback(false);
            return;
          });
        //================================== 
        return;
      })
      .catch(async function () {
        //================================ Read token file FAIL

        //==================================GET AUTH TOKEN
        console.log("No acess token - Getting Auth response - RedditAPI.js - RefreshToken() ");

        await AuthRequestPromise()
          .catch(() => {
            console.log("Error receiving auth response. RedditAPI.js - RefreshToken()");
            erroCallback(false);
            return;

          })
          .then(async function (result) {
            fs.writeFile("Tokens", JSON.stringify(result), function (error) {
              if (error) return console.log(error);
            });
            console.log("Received valid AUTH response. RedditAPI.js - RefreshToken()");
            await RefreshTokenPromise();
          });
        return;
      });
  }
  catch (error) {
    // handle getting accesscode etc 
    console.log(error);
    erroCallback(false);
    return;
  }
}

async function ReadTokenFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("Tokens", 'utf8', function (err, data) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      if (data.length > 0) {
        const obj = JSON.parse(data);

        Refresh_Token = obj.refresh_token;
        Acess_Token = obj.access_token;
        console.log('Loaded Acess Tokens - RedditAPI.js - ReadTokenFile()');
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
      await RefreshTokenPromise()
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
        .then(() => {
          console.log("Sucesfully retrieved acess token! Token: " + Acess_Token);
          resolve(Acess_Token);
          console.log();
          console.log('===============================================');
          console.log('=========END GetAutheticationToken=============');
          console.log('===============================================');
          console.log();
          return;
        })
        .catch(() => {
          console.log("There was an error refreshing the token! - RedditAuthentication.js");
          reject(false);
          console.log();
          console.log('===============================================');
          console.log('=========END GetAutheticationToken=============');
          console.log('===============================================');
          console.log();
          return;
        });
    })
  }
}