const https = require('https')

const data =JSON.stringify({    '' : ''})

const options ={
    hostname: 'api.guildwars2.com',
    path: '/v2/account',
    method: 'GET',
    headers: {
        Authorization : 'Bearer 2F684A92-4D07-ED49-8911-BAE656F4971D63C90C47-B9F6-47CE-A6B8-131B9CCAA52B'
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      console.log(d.toString('utf8'));
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
//   req.write(data)
  req.end()