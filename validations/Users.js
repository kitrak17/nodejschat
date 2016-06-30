function user() { };
user.prototype.constructor = user;

//Validation to login user
user.prototype.login =  function(req, res, next) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    next();
}

//Validation to signup user
user.prototype.signup =  function(req, res, next) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("first_name", "First Name is required").notEmpty();
    req.checkBody("last_name", "Last Name is required").notEmpty();
    next();
}

//Validation to send msg
user.prototype.sendmsg =  function(req, res, next) {
    req.checkBody('sender', 'Sender ID is required').notEmpty();
    req.checkBody("receiver", "Receiver ID is required").notEmpty();
     req.checkBody("message", "Message is required").notEmpty();
    req.checkBody("token", "Token is required").notEmpty();
    next();
}

//Validation to get messages
user.prototype.allmessages =  function(req, res, next) {
    req.checkBody('sender', 'Sender ID is required').notEmpty();
    req.checkBody('receiver', 'Receiver ID is required').notEmpty();
    req.checkBody("token", "Token is required").notEmpty();
    next();
}

//Validation to chat lists
user.prototype.allchats =  function(req, res, next) {
    req.checkBody('user_id', 'User ID is required').notEmpty();
    req.checkBody("token", "Token is required").notEmpty();
    next();
}

//Validation to all contacts
user.prototype.allcontacts =  function(req, res, next) {
    req.checkBody('user_id', 'User ID is required').notEmpty();
    req.checkBody("token", "Token is required").notEmpty();
    next();
}

module.exports = new user();