const express = require('express');
const crypto = require('crypto');
const request = require('request');
const router = express.Router();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:5000/auth/callback";

router.get('/login', (req, res) => {
    var scope = [
      "repo",
      "user",
    ].join(" ");

    var auth_query_parameters = new URLSearchParams({
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    });

    res.redirect('https://github.com/login/oauth/authorize?' + auth_query_parameters.toString());
});

router.get('/callback', (req, res) => {

  var code = req.query.code;
  console.log(code);

  var authOptions = {
    url: 'https://github.com/login/oauth/access_token',
    form: {
      code: code,
      redirect_uri: "http://localhost:5000/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      process.env.ACCESS_TOKEN = access_token;
      res.redirect('http://localhost:5173/')
    }
  });
})

router.get('/token', (req, res) => {
  var token = process.env.ACCESS_TOKEN;
  console.log(token);
  if (token !== '') {
    console.log('oui');
    res.json(
      {
          access_token: process.env.ACCESS_TOKEN
      })
  }
  else {
    console.log('non');
    res.sendStatus(403);
  }
})

module.exports = router;