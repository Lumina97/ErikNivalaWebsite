const axios = require('axios').default;
const fs = require('fs');

const querystring = require('querystring');



let Refresh_Token ;
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


module.exports =
{
  GetAutheticationToken: async function () {

    return new Promise(async function (resolve, reject) {
      await RefreshTokenPromise().catch(() => {
        console.log("There was an error refreshing the token! - RedditAuthentication.js");
        reject(false);
      }).then(()=>{
          console.log("Sucesfully retrieved acess token! Token: " + Acess_Token);
        resolve(Acess_Token);
      });
    })
  }
}