#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var renderer = path.join(__dirname, 'renderer.js');

var argv = require('yargs')
    .usage('Usage: $0 --screenshots=<sketchFolder> [options]')
    .example('$0 --screenshots=<sketchFolder>', 'Create documentation assets for the p5 sketch in <sketchFolder>')
    .alias('s', 'screenshots')
// .nargs('s')
    .describe('s', 'Specifies the sketch folder to compile into docs.')
    .alias('g', 'gif')
// .nargs('g')
    .describe('g', 'Create an animated gif of the specified sketch.')
    .alias('v', 'video')
// .nargs('v')
    .describe('v', 'Output an mp4 video of the specified sketch.')
// .demandOption(['s'])
    .help('h')
    .alias('h', 'help')
    .argv;

var currentFolder = process.cwd();
var filenameArray = [];

var operations = {
  screenshots: createScreenshots,
  s: createScreenshots,
  video: createVideo,
  v: createVideo,
  gif: createGif,
  g: createGif,
  help: showHelp,
  h: showHelp
};

function main (args){
  for (var n in args){
    if (operations.hasOwnProperty(n)){
      if (args[n] !== undefined && args[n] !== false) {
        operations[n]();
        break;
      }
    }
  }
}

function say(message, additionals){
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + message + " |");
  console.log("-------------------------------------------------------------------");
  console.log("|                                                                 |");
  console.log("|   The following arguments do not match doCode's command list:   |");
  console.log("|                                                                 |");
  if(additionals){
    for (var n=0; n<additionals.length; n++){
      console.log("|    • " + additionals[n] + (" ".repeat(59-additionals[n].length)) + "|");
    }
  }
  console.log("|                                                                 |");
  console.log("-------------------------------------------------------------------");
}

function reportErrors(args){
  var syntaxError = false;
  var mistakes = [];

  if (args._.length > 0){
    syntaxError = true;
    for (var i=0; i<args._.length; i++){
      mistakes.push(args._[i]);
    }
  }

  if (syntaxError === true){
    var msg = clc.red(" ☝️' doCode Errors");
    say(msg, mistakes);
  }
}

function createScreenshots(operations){
  var source, target;

  if (typeof(argv.s) === 'boolean'){
    target = currentFolder + '/docode_screenshots/sketch.png';
    source = 'file:///' + currentFolder + '/index.html';
  } else {
    argv.s = argv.s.replace('~', os.homedir());
    target = argv.s + '/docode_screenshots/sketch.png';
    source = 'file:///' + argv.s + '/index.html';
  }

  renderWebpage(source, target, function (err) {
    if (err){
      throw err;
    }

    var msg = " 🖼  👍  Screenshots were created successfully";
    say("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");
  });
}


function createVideo(operations){
  imageMagicWarning();
  var msg = " 📹 😔  Video creation is not supported yet";
  say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
}

function createGif(operations){
  imageMagicWarning();
  renderGif(function (){
    // var msg = " 🌅 😔  GIF creation failed";
    // say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  });
}


function showHelp(operations){
  var msg = " 💡 😔  Preview is not supported yet";
  say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
}

function renderWebpage (source, target, cb) {
  var args = [renderer, source, target];
  var child = spawn(phantomjs, args, { stdio: 'ignore' });

  // I'm not sure this part is necessary with our current naming scheme. We should try to figure out
  // the right solution to this though. -mgs
  //---
  // Very annoying but the precision on file modification time seems to preclude that from being used
  // to sort our file order this is not a smart/clever way to workaround but .. it works. -mgs
  for(var i = 0; i < 30; i++){
    filenameArray.push("sketch" + i + ".png");
  }

  child.on('error', cb);
  child.on('exit', function (code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function renderGif(cb) {
  // it will be easy to add more customizations by just adding additional args to this array
  var args = ["delay 20 -loop 0 ", argv.input, argv.output];
  var child = spawn('convert', args);

  child.on('error', cb);
  child.on('exit', function (code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function imageMagicWarning(){
  var lineOne = '👉  Please make sure that you have ImageMagick installed on you machine.';
  var url = 'https://www.imagemagick.org/script/download.php';
  var lineTwo = '   To install ImageMagick go to: ';
  var repeat = 85 - lineTwo.length - url.length;
  //  + clc.cyan(url);

  console.log(clc.yellow("\n---------------------------------------------------------------------------------------"));
  console.warn(clc.yellow("| ") + lineOne + (" ".repeat(86-lineOne.length)) + clc.yellow("|"));
  console.warn(clc.yellow("| ") + lineTwo + clc.cyan(url) + (" ".repeat(repeat)) + clc.yellow("|"));
  console.log(clc.yellow("---------------------------------------------------------------------------------------\n"));
}

main(argv);
reportErrors(argv);
