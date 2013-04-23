var RoomModel = require('../models/roommodel'),
RoomController = {
  index:function (req,res){
    RoomModel.find({}, function(err, rooms){
      if (err) return res.json(500, {error:"internal"});
      res.json(200, rooms);
    });
  },
  show:function (req,res){
    RoomModel.findById(req.params.id, function(err, room){
      if (err) return res.json(500, {error:"internal"});
      res.json(200, room);
    });
  },
  create:function (req,res){
    RoomModel.create(req.body, function(err, room){
      if (err) return res.json(500, {error:"internal"});
      res.json(201, room);
    });
  },
  update:function (req,res){},
  delete:function (req,res){}
};

module.exports = RoomController;