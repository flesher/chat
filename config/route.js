var PagesController = require('../controllers/pagescontroller'),
AuthController = require('../controllers/authcontroller'),
RoomController = require('../controllers/roomcontroller'),
AccountController = require ('../controllers/accountcontroller'),
passport = require('passport');

var verifyUser  = function(req,res,next){
  if(req.url.match('^/(stylesheets|js|images)')) return next();
  if(req.session.passport.user) return next();
  res.redirect('/login');
};

var route = function(app){
  app.get('/login', AuthController.login);
  
  // Redirect the user to Google for authentication.  When complete, Google
  // will redirect the user back to the application at
  //     /auth/google/return
  app.get('/auth/google', passport.authenticate('google'));
  
  // Google will redirect the user to this URL after authentication.  Finish
  // the process by verifying the assertion.  If valid, the user will be
  // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/return', 
    passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));
                                    
  app.all('*', verifyUser);
  app.get('/', PagesController.home);
  
  app.get('/cat', PagesController.cat);
  app.get('/dog', PagesController.dog);
  
  app.get('/rooms', RoomController.index);
  app.get('/rooms/:id', RoomController.show);
  app.post('/rooms', RoomController.create);
  app.put('/rooms/:id', RoomController.update);
  app.delete('/rooms/:id', RoomController.delete);
  
  app.get('/account', AccountController.show);
  app.post('/account', AccountController.update);
  
};

module.exports = route;