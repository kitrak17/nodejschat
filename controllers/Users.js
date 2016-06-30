//User controller
var md5 	= require('md5');
var mongoose = require('mongoose');
var chatModel = require('../models/chatModel.js');

function user(){};
user.prototype.constructor = user;

//Function to login
user.prototype.login =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {
    	var pass = md5(cred.password);
    	 var currentDate = new Date();
    	var token = md5(cred.username + currentDate);
    	chatModel.User.findOneAndUpdate({ 'username': cred.username, 'password':pass }, { token:token }, function(err, user) {
		  if (err) throw err;
		  if(user) {
		  		user.token = token;
			  	res.status(200).json([{msg: "Logged in successfully", data: user}]); 
		  } else {
		  		res.status(202).json([{msg: "Login failed"}]); 
		  }
		});
    }		
}


//Function to login
user.prototype.signup =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {

    	chatModel.User.findOne({ 'username': cred.username }, '', function (err, person) {
			if(person) {
		    	res.status(200).json([{msg: "Username already taken."}]); 
			} else {
				var pass = md5(cred.password);
		    	var newUser = chatModel.User({
				  username: cred.username,
				  password: pass,
				  email: cred.email,
				  first_name : cred.first_name,
				  last_name :  cred.last_name
				});
				newUser.save(function(err) {
				  if (err) throw err;
				  res.status(200).json([{msg: "Registered Success"}]); 
				});
			}
		});

    }		
}

//Function to send msg
user.prototype.sendmsg =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {
    	// Verify Token
    	chatModel.User.findOne({ 'token': cred.token, 'user_id':cred.user_id }, '', function (err, person) {
			if(person) {
				chatModel.chatHistory.findOne({ 
			    		$and: [
					          { $or:[ {'sender':cred.receiver}, {'receiver':cred.receiver} ] },
					          { $or:[ {'sender':cred.sender}, {'receiver':cred.sender} ] }
					      ]
	      			}, '', function (err, history) {
	      				if(history) {

	      				} else {
	      						// Insert new history
								var newHistory = chatModel.chatHistory({
								  sender: cred.sender,
								  receiver: cred.receiver
								});
								newHistory.save(function(err) {
								  if (err) throw err;
								});
	      				}	
	      				// Insert new message
						var newMsg = chatModel.Message({
						  sender: cred.sender,
						  receiver: cred.receiver,
						  message: cred.message,
						});
						newMsg.save(function(err) {
						  if (err) throw err;
						  res.status(200).json([{msg: "Message sent"}]); 
						});
				})
			} else {
		  		res.status(202).json([{msg: "Invalid Token"}]); 
		  	}
		})
    }		
}


//Function to get all messages
user.prototype.allmessages =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {
    	// Verify Token
    	chatModel.User.findOne({ 'token': cred.token, 'user_id':cred.user_id  }, '', function (err, person) {
			if(person) {
		    	chatModel.Message.find({ 
		    		$and: [
				          { $or:[ {'sender':cred.receiver}, {'receiver':cred.receiver} ] },
				          { $or:[ {'sender':cred.sender}, {'receiver':cred.sender} ] }
				      ]
      			}, function(err, messages) {
				  if (err) throw err;
				  res.status(200).json([{data: messages}]); 
				}) //.limit(20).sort({'created_at': -1})
			} else {
		  		res.status(202).json([{msg: "Invalid Token"}]); 
		  	}
		})
    }		
}

//Function to get chat lists
user.prototype.allchats =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {
    	// Verify Token
    	chatModel.User.findOne({ 'token': cred.token, 'user_id' : cred.user_id  }, '', function (err, person) {
			if(person) {
		    	chatModel.chatHistory.find({ 
		    					$or:[ 
		    						{'sender':person._id}, 
		    						{'receiver':person._id} 
		    					] })
		    					.select({ "sender": 1, "receiver": 1})
		    					.populate({
									    path: 'receiver',
									    match: { _id: { $ne: person._id }},
									    select: '_id first_name last_name'
									})
		    					.populate({
									    path: 'sender',
									    match: { _id: { $ne: person._id }},
									    select: '_id first_name last_name'
									})
		    					.sort({'created_at': -1})
		    					.exec(function(err, chats) {
									  res.status(200).json(chats); 
								})
			} else {
		  		res.status(202).json([{msg: "Invalid Token"}]); 
		  	}
		})
    }		
}


//Function to get contacts
user.prototype.allcontacts =  function(req, res) {
	var cred 	= req.body;
	var error 	= req.validationErrors();
    if(error) { 
        res.status(202).json(error); 
    } else {
    	// Verify Token
    	chatModel.User.findOne({ 'token': cred.token, 'user_id' : cred.user_id }, '', function (err, person) {
			if(person) {
		    	chatModel.User.find({ user_id: { $ne: cred.user_id } }).exec(function(err, contacts) {
				  res.status(200).json(contacts); 
				})
			} else {
		  		res.status(202).json([{msg: "Invalid Token"}]); 
		  	}
		})
    }		
}


module.exports = new user();