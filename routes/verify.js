/*eslint no-undef: "error"*/
/*eslint-env node*/

var app = require('express')();
var router = app.Router();
// var bodyParser = require('body-parser');
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
