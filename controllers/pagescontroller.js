var PagesController = {

	home:function (req, res) {
		res.render('pages/home', {user:req.user});
	
	}

};

module.exports = PagesController