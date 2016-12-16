/*eslint no-undef: "error"*/
/*eslint-env node*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

var express = require('express');
var router = express.Router();

var request = require('request');
// var fs      = require('fs');

var imageType = require('image-type');

var app = express();
var bodyParser = require('body-parser');

var gcs = require('@google-cloud/storage')({
  projectId: '<projectID>',
  keyFilename: '/app/testfacebook-37d35-firebase-adminsdk-xjhtw-a095d994f6.json'
});

var streamifier = require('streamifier');

var bucket = gcs.bucket('testfacebook-37d35.appspot.com');

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
                    respondMessage(req.body.events[i].message.text, req.body.events[i].replyToken, res);

                } else if(req.body.events[i].message.type == 'image') {
                    headers = {
                        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
                    };

                    options = {
                        url: 'https://api.line.me/v2/bot/message/' + req.body.events[i].message.id + '/content',
                        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
                        headers: headers,
                        encoding: null,
                        method: 'GET'
                    };
                    
                    getImage(options, req.body.events[i], res);
                    
                }
            }
        }
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.type('jpg'); 
    var file = bucket.file("test.jpg");
    file.download().then(function(data) {
        var contents = data[0];
        res.end(contents, 'binary');
    });
});

module.exports = router;

function respondMessage(text, replyToken, res) {
    var message = {
        'type': 'text',
        'text': text
    };

    var data = {
        'replyToken': replyToken,
        'messages': [message]
    };

    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
    };

    console.log(JSON.stringify(headers));
    console.log(JSON.stringify(data));

    var options = {
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
}

function getImage(options, event, res) {
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log('type: ' + typeof(body));
            // console.log('content: ' + body);
            // console.log('content json: ' + JSON.stringify(body));
            // res.send(typeof(body));

            // var blob = bucket.file("test.jpg");
            // var blobStream = blob.createWriteStream({
            //     metadata: {
            //         contentType: 'image/jpeg',
            //         metadata: {
            //             custom: 'metadata'
            //         }
            //     }
            // }).on('error', function(err){
            //     console.log('error: ' + err);
            //     res.send("error: " + err);
            //     return;
            // }).on('finish', function(){
            //     console.log('success');
            //     res.status(200).send('success');
            // });
            // streamifier.createReadStream(body).pipe(blobStream);

            console.log('image mime: ' + imageType(body).mime);
            if(imageType(body).mime == 'image/jpg' || imageType(body).mime == 'image/jpeg') {
                getProfileImageAndRespond(event, body, res);
            } else {
                respondMessage('กรุณา upload รูปประเภท jpg เท่านั้น', event.replyToken, res);
            }

        } else {
            console.log('error');
            res.send("error");
        }
    });
}

function getProfileImageAndRespond(event, image ,res) {
    var headers = {
        'Authorization': 'Bearer r66gB/QeQB9YKgvhT9QZoXmRuf0VIIIfsKiszE6+Qa0P2goun2p1hqBhuJwlTZNA5VOeojEffX95TJB162tqBXNWLxfuQzVlfuThpbzhtPhs9HddCEtj0+GxlJXufpEMAdHAhuu0INpJZxZudiYbYAdB04t89/1O/w1cDnyilFU='
    };

    var options = {
        url: 'https://api.line.me/v2/bot/profile/' + event.source.userId,
        proxy: 'http://fixie:IaHUTllshvVDVfU@velodrome.usefixie.com:80',
        headers: headers,
        method: 'GET'
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var pictureUrl = body.pictureUrl;
            console.log('pictureUrl: ' + pictureUrl);
            var photo_meta = {
                        'id': '999999999',
                        'fname': 'fname',
                        'lname': 'lname',
                        'email': 'email',
                        'profile_url': body.pictureUrl,
                        'share': 'share'
                    };

            var headers = {
                'Content-Type': 'multipart/form-data'
                };


            var reqPost = request.post({url:'http://console.selfiprint.com/api/1.0/uploadPhoto', headers: headers}, 
                function optionalCallback(err, httpResponse, body) {
                    if (err) {
                        console.error('upload failed:', err);
                    } else {
                        console.log('Upload successful!  Server responded with:', body);
                    }
                }
            );

            console.log('photo_meta ' + JSON.stringify(photo_meta));

            var form = reqPost.form();
            form.append('hashtag', 'selfitest');
            form.append('photo_meta', JSON.stringify(photo_meta));
            form.append('photo_file', image, {
                filename: 'myfile.jpg',
                contentType: 'image/jpg'
            });
        }else {
            console.log('error');
            res.send("error");
        }
    });
}
