//window.alert = function(){};
var defaultCSS = document.getElementById('bootstrap-css');
function changeCSS(css){
    if(css) $('head > link').filter(':first').replaceWith('<link rel="stylesheet" href="'+ css +'" type="text/css" />'); 
    else $('head > link').filter(':first').replaceWith(defaultCSS); 
}
$( document ).ready(function() {
  var iframe_height = parseInt($('html').height()); 
  window.parent.postMessage( iframe_height, 'http://127.0.0.1:3000/');
});

(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            socket.emit('chat message', text+'|'+$.cookie("sendercookie"), $.cookie('chatNodeCookie'));
            var data = {
                sender: $.cookie("sendercookie"),
                user_id: $.cookie("usercookie"),
                receiver: $.cookie("receivercookie"),
                message: text,
                token: $.cookie("tokencookie")
            }
            $.ajax({
                url: "sendmsg",
                method: "POST",
                data: data
              }).done(function(data, statusText, xhr) {
                console.log(data);
              }).fail(function(status, xhr) {  
            });
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
           /* message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw(); */
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        socket.on($.cookie('chatNodeCookie'), function(msg){
            data = msg.split('|');
                if(data[1]==$.cookie("sendercookie"))  message_side = 'right'; else message_side = 'left';
                $('.messages').append('<li class="message '+message_side+' appeared"><div class="avatar"></div><div class="text_wrapper"><div class="text">'+data[0]+'</div></div></li>');
                $('.messages').scrollTop($('.messages')[0].scrollHeight);
        });

        socket.on('init', function(username) {
            users[username] = socket.id;    // Store a reference to your socket ID
            sockets[socket.id] = { username : username, socket : socket };  // Store a reference to your socket
        });

        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
       // sendMessage('Hello Philip! :)');
    });
}.call(this));