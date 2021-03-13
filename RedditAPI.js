const axios = require('axios').default;
const fs = require('fs');

const querystring = require('querystring');

let Refresh_Token;
let Acess_Token;

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

//Possible user to determine if I need a new code
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
      const refreshTokenResponse = await AuthRefreshTokenPromise();
      console.log(refreshTokenResponse);
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

      const obj = JSON.parse(data);

      Refresh_Token = obj.refresh_token;
      Acess_Token = obj.access_token;

      resolve("Loaded Acess Tokens");
    });
  })
}

RefreshToken();

