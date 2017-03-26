#!/usr/bin/env node

var clc = require('cli-color');

var operations = [];

//

var path = require('path')
var spawn = require('child_process').spawn
var phantomjs = require('phantomjs2').path

var renderer = path.join(__dirname, 'renderer.js')
var fileNameArray = [];

function renderWebpage (source, target, cb) {
  var args = [renderer, source, target];
  var child = spawn(phantomjs, args, { stdio: 'ignore' });

  // Very annoying but the precision on file modification time seems to preclude that from being used to sort our file order
  // this is not a smart/clever way to workaround but .. it works.
  for(var i = 0; i < 30; i++){
    fileNameArray.push("sketch" + i + ".png");
  }
  
  child.on('error', cb);
    child.on('exit', function (code) {
      if (code !== 0) {
        return cb(new Error('Bad exit code: ' + code));
      }

      cb(null);
    });
}

function main(sketchFolder){
  renderWebpage(sketchFolder, 'sketch.png', function (err) {
    if (err){
      throw err;
    }

    console.log('Success!');
  });
}

// this will soon use the arguments passed the CLI
main('file:///Users/mgs/Documents/p5.Sketchbook/testingDocode/index.html');

function synthaxCheckup (args){
  var synthaxError = false;
  var mistakes = [];

  for (var i=2; i<args.length; i++){

      switch (args[i]) {
        case 'build':
          operations.push(args[i]);
          break;
        default:
          synthaxError = true;
          mistakes.push(args[i]);
      }
  }

  if (synthaxError === true){
    console.log("-------------------------------------------------------------------");
    console.log("|" + clc.red(' ☝️  doCode Errors                                               ') + " |");
    console.log("-------------------------------------------------------------------");
    console.log("|                                                                 |");
    console.log("|   The following arguments do not match doCode's command list:   |");
    console.log("|                                                                 |");
    for (var n=0; n<mistakes.length; n++){
      console.log("|    • " + mistakes[n] + (" ".repeat(59-mistakes[n].length)) + "|");
    }
    console.log("|                                                                 |");
    console.log("-------------------------------------------------------------------");

  }


  return synthaxError;
}

function executeCommands(operations){
  console.log('yay!');
}

isErrors = synthaxCheckup(process.argv);

if (isErrors === false){
  executeCommands(operations);
}
