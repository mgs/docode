#!/usr/bin/env node

var clc = require('cli-color');

var operations = [];

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
