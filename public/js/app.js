(function () {
  
  window.Application = can.Construct({
    //static properties
    Models:{},
    Controllers:{},
    boot:function (data) {
      new window.Application.Controllers.Chat('#main', data);
    }
  },{
    //instance or prototype properties
    
  });
  
})()