const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
    console.log(req.session.state);
    console.log(req.query);
    next()
});

router.use(function (req, res, next) {
    const { callbackError, code, state } = req.query;
    
    if (callbackError || !code) {
      console.log('Sending to iDEA - Callback issue.');
      return res.redirect('https://idea.org.uk');
    }

    if (req.session.state != state) {
      console.log('Invalid session state, returning to iDEA.');
      req.session.destroy(() => {
        return res.redirect(process.env.IDEA_URL);
      });
    }

    next()
})

router.get('/', function(req, res) {
    // get access token
    console.log('main boss')
    const options = {
      method: 'POST',
      url: `${process.env.AUTH_URL}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: {
        grant_type: 'authorization_code',
        client_id:process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET,
        code: req.query.code,
        redirect_uri:process.env.CALLBACK_URL,
      },
      json: true,
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      console.log('callback body', body);
      req.session.access_token = body.access_token;
      return res.redirect('/');
    });
  });

module.exports = router;