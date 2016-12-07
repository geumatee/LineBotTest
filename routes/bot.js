/*eslint no-undef: "error"*/
/*eslint-env node*/

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('bot respond with a resource');
});

module.exports = router;
