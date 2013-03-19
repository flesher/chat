(function (RoomModel, Templates) {

	var Chat = can.Control({

		init:function (element, options) {
			console.log('Chat controller initiated', arguments);
		},

		"#outgoing keyup": function (textarea, event) {
			if (!event.shiftkey && event.which==13) {
				var message = textarea.val();
				this.socket.emit('message', {room:this.room._id, message:message, from:this.options.user.displayName});
				this.element.find('#incoming').append('<pre><p class="right">'+message+'</p></pre>');
				textarea.val(''); 
			}
		},

		"form submit": function (form, event) {
			event.preventDefault();
			var title = $(form).children('input[type="text"]').val();
			var Room = new RoomModel({title: title});
			Room.save(function (room){
				// can.route.attr({room_id: room._id});
				window.location.hash = "#!" + room._id; //redirects to room when created
			});
		},

		"route": function () {
			
			if (this.socket != undefined){
				this.socket.disconnect();
			}


			var self = this;
			RoomModel.findAll({}, function (rooms) {
				self.element.html(Templates["pages/partial.rooms.jade"]({rooms:rooms}));
			});
		},

		":room_id route": function (data) {
				var self = this;
				RoomModel.findOne({id: data.room_id}, function(room) {
					self.room = room;
					self.element.html(Templates["pages/partial.room.jade"]({}));

					if ( !self.socket ){
						
						self.socket = io.connect(window.location.origin);	

						self.socket.on('message', function (data) {
							if (data.from == "system"){
								self.element.find('#incoming').append('<pre><p class="left system">'+data.message+'</p></pre>');
							} else {
								self.element.find('#incoming').append('<pre><p class="left">'+data.message+'</p></pre>');
							}
						});

					} else {

						self.socket.socket.connect();

					}

					self.socket.emit('join', {room:room._id, from:self.options.user.displayName});


			});
		}

	});

	window.Application.Controllers.Chat = Chat;


})(window.Application.Models.Room, window.Application.Templates);