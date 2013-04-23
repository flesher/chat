var PagesController = {

  home:function(req,res){
    res.render('pages/home', {user:req.user}); //user's info passed to front end
  },


  cat:function(req,res){
    res.send(200, 'meow')
  },

  dog:function(req,res){
    res.render('pages/dog');
  }
  
};

module.exports = PagesController;