(function (RoomModel, Templates) {

	var Chat = can.Control({

		init:function (element, options) {
			console.log('Chat controller initiated', arguments);
		},

		"#outgoing keyup": function (textarea, event) {
			if (!event.shiftkey && event.which==13) {
				var message = textarea.val();
				this.socket.emit('message', {room:this.room._id, message:message, from:this.options.user.displayName});
				this.element.find('#incoming').append('<p>'+message+'</p>');
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

					self.socket = io.connect(window.location.origin);

					self.socket.emit('join', {room:room._id, from:self.options.user.displayName});

					self.socket.on('message', function (data) {
						self.element.find('#incoming').append('<p>'+data.message+'</p>');
					});
			});
		}

	});

	window.Application.Controllers.Chat = Chat;


})(window.Application.Models.Room, window.Application.Templates);