(function () {

	window.Application = can.Construct( {
		//static props
		Models:{},
		Controllers:{},
		
		boot: function (data) {

			new window.Application.Controllers.Chat('#main', data);

		}
	},{
		//instance properties
	});

})()