var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost/kitrak_chat');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);


// User Table
var userSchema = new Schema({
		user_id : Number,
		first_name: String,
		last_name: String,
	    username: { type: String, required: true, unique: true },
	    password: { type: String, required: true },
	    email: String,
	    token: String,
	    created_at: Date,
	    updated_at: Date
});
userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });
var User = mongoose.model('User', userSchema); 
// on every save, add the date
userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});



// Message Table
var messageSchema = new Schema({
		msg_id : Number,
		sender : {type: Schema.Types.ObjectId, ref: 'User' },
		receiver: {type: Schema.Types.ObjectId, ref: 'User' },
	    message: String,
	    created_at: Date,
	    updated_at: Date
});
// on every save, add the date
messageSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});
messageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'msg_id', startAt: 1 });
var Message = mongoose.model('Message', messageSchema); 



// Chat History Table
var chatHistorySchema = new Schema({
		sender : {type: Schema.Types.ObjectId, ref: 'User' },
		receiver: {type: Schema.Types.ObjectId, ref: 'User' },
	    created_at: Date,
	    updated_at: Date
});
// on every save, add the date
chatHistorySchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});
var chatHistory = mongoose.model('chatHistory', chatHistorySchema);


// Export All Tables
module.exports = {
    User: User,
    Message: Message,
    chatHistory : chatHistory
};