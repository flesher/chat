var mongoose = require('mongoose'),
RoomSchema = mongoose.Schema({
  title: String
}),

RoomModel = mongoose.model('room', RoomSchema);

module.exports = RoomModel;