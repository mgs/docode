/* eslint-env phantomjs */

var system = require('system');
var page = require('webpage').create();

page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  margin: '0.25in'
};

function takeScreenshot(i){
  setTimeout(function(){
    if (i<10){
      page.render(system.args[2].replace('.png', '0' + i + '.png'));
    } else {
      page.render(system.args[2].replace('.png', i + '.png'));
    }
  }, system.args[4]);
}

page.open(system.args[1], function(status){
  for(var i = 0; i < system.args[3]; i++){
    takeScreenshot(i);
  }

  setTimeout(function(){
    phantom.exit();
  }, 3000);
});
