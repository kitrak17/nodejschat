var express = require('express');
var router = express.Router();
var path    = require("path");

var usercontroller = require('../controllers/Users');
var validations = require('../validations/Users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join('/var/www/html/nodejs/kitrak_chat/views/login.html'));
});

router.get('/chatlist', function(req, res, next) {
  res.sendFile(path.join('/var/www/html/nodejs/kitrak_chat/views/chatlist.html'));
});

router.get('/chat', function(req, res, next) {
  res.sendFile(path.join('/var/www/html/nodejs/kitrak_chat/views/chat.html'));
});

router.get('/logout', function(req, res, next) {
  res.sendFile(path.join('/var/www/html/nodejs/kitrak_chat/views/logout.html'));
});



router.route('/login').post(validations.login,usercontroller.login);
router.route('/signup').post(validations.signup,usercontroller.signup);
router.route('/sendmsg').post(validations.sendmsg,usercontroller.sendmsg);
router.route('/allmessages').post(validations.allmessages,usercontroller.allmessages);
router.route('/allchats').post(validations.allchats,usercontroller.allchats);
router.route('/allcontacts').post(validations.allcontacts,usercontroller.allcontacts);

module.exports = router;