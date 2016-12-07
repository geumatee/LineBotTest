/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

var express = require('express');
var router = express.Router();

var request = require('request');
// var fs      = require('fs');

var app = express();
var bodyParser = require('body-parser');

var firebase = require("firebase-admin");
var serviceAccount = require("google-services.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://testfacebook-37d35.firebaseio.com"
});

app.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/',function(req, res){
    if(req.body != undefined) {
        console.log('request body: ' + JSON.stringify(req.body));
        var i;
        var headers;
        var options;
        for(i = 0; i < req.body.events.length; i++) {
            if(req.body.events[i].type == 'message') {
                if(req.body.events[i].message.type == 'text') {
                    var message = {
                        'type': 'text',
                        'text': req.body.events[i].message.text
                    };

                    var data = {
                        'replyToken': req.body.events[i].replyToken,
                        'messages': [message]
                    };

                    headers = {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                    };

                    console.log(JSON.stringify(headers));
                    console.log(JSON.stringify(data));

                    options = {
                        url: 'https://api.line.me/v2/bot/message/reply',
                        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(data)
                    };

                    request(options, function (error, response, body) {
                        console.log("respond " + error + " " + JSON.stringify(response) + " " + JSON.stringify(body));
                        res.send(JSON.stringify(response));
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                        }
                    });
                } else if(req.body.events[i].message.type == 'image') {
                    headers = {
                        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                    };

                    options = {
                        url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
                        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
                        headers: headers
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // fs.writeFile('/app/public/downloaded.jpg', body, 'binary', function (err) {
                            //     console.log(err);
                            //     res.send(err);
                            // });
                            var metadata = {
                                contentType: 'image/jpeg',
                            };
                            var imageRef = firebase.storage().ref().child('image.jpg');
                            imageRef.put(body, metadata).then(function(snapshot){
                                console.log('success');
                                res.send('success');
                            });
                        } else {
                            console.log('error');
                            res.send("error");
                        }
                    });
                }
            }
        }
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.type('jpg'); 
    res.end('/app/public/downloaded.jpg', 'binary');
});

module.exports = router;
