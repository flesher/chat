 
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: __dirname+'/public/images'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  
  /*
app.use(function (req,res,next){
    if(req.user){
      app.locals.user = req.user;
    }
    next();
  });
*/
  
  app.locals.title = "Welcome to Chat";
  
  //mongo db connection
  mongoose.connect('mongodb://localhost/chat_DEV');
  
  app.use(express.session({
    secret: "Ahmed how did you know about who done it in the lounge?",
    store: new MongoStore({
      mongoose_connection: mongoose.connection,
      db: 'chat_DEV'
    })
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) { //passport stuff should be in separate file
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var GoogleStrategy = require('passport-google').Strategy;
var UserModel = require('./models/usermodel');

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {//capturing data for mongoose
    profile.email = profile.emails[0].value;
    UserModel.findOneAndUpdate({email:profile.email}, {$set:profile, $inc:{logins:1}}, {upsert: true}, done);

    console.log(arguments);

  }
));

route(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var RoomModel = require('./models/roommodel');

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//socket io stuff
io.sockets.on('connection', function (socket) {//callback that binds only that socket
  
  socket.emit('message', {message:"Connected to Chat", from:"system", avatar:""});
  
  socket.on('join', function(data){
    RoomModel.findById(data.room, 'title', function(err, room){
      if (!err && room) {
        socket.join(room._id);
        socket.broadcast.to(room._id).emit('message', {message:data.from+" joined the room", from:"system", avatar:""});
        socket.emit('message', {message:"You haved joined room "+room.title, from:"system", avatar:""});
      }
    });
  });
  
  socket.on('leave', function(data){
    socket.leave(data.room);
    socket.broadcast.to(data.room).emit('message', {message:data.from+" left the room.", from:"system"});
  });
  
  socket.on('message', function(data){ 
    socket.broadcast.to(data.room).emit('message', data);
  });
  
  

});