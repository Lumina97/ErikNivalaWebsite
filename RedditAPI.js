const https = require('https')
var querystring = require('querystring');

const data = querystring.stringify({
  grant_type: 'authorization_code',
  code: "uPO4ttTrkGqob7Mc95sqsuN0q1R-DA",
  redirect_uri: 'https://www.eriknivala.com'
})

const secretstr = 'W0bNZeU8oYaUxCzqcWuf89JLMnqMVg'

const options = {
  hostname: 'www.reddit.com',
  path: '/api/v1/access_token',
  method: 'POST',
  headers: {
    "Authorization": "Basic " + Buffer.from('ZHmLbNUoaVSVdw' + ":" + "W0bNZeU8oYaUxCzqcWuf89JLMnqMVg", "utf8").toString("base64"),
    'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
}

const req = https.request(options, res => {

  console.log(`statusCode: ${ res.statusCode }`)
  res.on('data', d => {
    console.log(d.toString('utf8'));

  })
})
req.on('error', error => { console.error(error) })
req.write(data)
req.end()