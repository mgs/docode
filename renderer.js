/* eslint-env phantomjs */

var system = require('system')
var page = require('webpage').create()

page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  margin: '0.25in'
}

function takeScreenshot(i){
  setTimeout(function(){
    page.render(system.args[2].replace('.png', i + '.png'));
  }, 100);
}

page.open(system.args[1], function(status){
  for(var i = 0; i < 30; i++){
    takeScreenshot(i);
  }
  
  setTimeout(function(){
    phantom.exit();
  }, 3000);
});
