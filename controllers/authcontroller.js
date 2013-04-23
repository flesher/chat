var AuthController = {
  
  login: function (req, res) {
    res.render('auth/login', {title: "Please login to Chat"});
  },
  logout: function (req, res) {
    delete req.session.passport.user;
    res.redirect('/login');
  }
  
};

module.exports = AuthController;