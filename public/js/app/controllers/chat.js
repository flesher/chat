(function (RoomModel, Templates) { //front end chat controller

  var Chat = can.Control({ //don't need static
    init:function (element, options){ //options.user is our user
      console.log('chat controller initialized', arguments);
      //this.options.user;
    },

    "#outgoing keyup": function(textarea, event){ //callback context automatically bound to controller thanks to can.js
      if(!event.shiftKey && event.which == 13){//if shift key is not down, and enter key is pressed, submit
        var message = textarea.val();
        this.socket.emit('message', {room:this.room._id, message:message, from:this.options.user.displayName});//emit takes 2 events 'message', {message...}
        //this.element.find('#incoming').append('<pre><p class="fromuser">'+message+'</p></pre>');
        this.element.find('#incoming').append(Templates["pages/partial.message.jade"]({message:message, source:'outgoing', from: ''}));
        textarea.val('');
      }
    },

    "form submit": function (form, event){ //form submits
      event.preventDefault();
      var title = $(form).children('input[type="text"]').val();
      var Room = new RoomModel({title:title}); //create room
      Room.save(function(room){ //save room
        //can.route.attr({room_id: room._id});//changes url for us, fires ":room_id route function below"
        window.location.hash = "#!" +room._id;//won't fire default route function below
      });
    },

    "route": function () { //nothing: get list of rooms
      var self=this;
      if(self.socket){
        self.socket.emit('leave', {room:self.room._id, from:self.options.user.displayName});
      }
      RoomModel.findAll({}, function(rooms){ //.findAll is an ajax call to the back end
        self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms})); //renders html partial.rooms.jade
      });
    },

    ":room_id route":function(data){ //route tells can.control its using route feature
      var self = this; //to get around it, this is controller, so self is controller
      RoomModel.findOne({id:data.room_id}, function(room){//callback function, this id different function
        self.room = room;
        self.element.html(Templates["pages/partial.room.jade"]({}));//set html of element
        if(!self.socket){
          self.socket = io.connect(window.location.origin);
          self.socket.on("message", function(data){ //catch data here
          //need an if statement to show system messages as system messages
          //if(data.from == "system"){
          data.source = "incoming";
          self.element.find('#incoming').append(Templates["pages/partial.message.jade"](data));
            //self.element.find('#incoming').append('<pre><p class="system">'+data.message+'</p></pre>'); //wrap message in paragraph, append to div#incoming
          //}else{
            //self.element.find('#incoming').append('<pre><p class="admin">'+data.message+'</p></pre>'); //wrap message in paragraph, append to div#incoming
          //}
          });
        }
        
        self.socket.emit('join', {room:room._id, from:self.options.user.displayName});//user has joined room
        
      }); 
    }
  }); 

  window.Application.Controllers.Chat = Chat;

})(window.Application.Models.Room, window.Application.Templates);