#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
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
  console.log( message );
  if(additionals){
    console.log("-------------------------------------------------------------------");
    console.log("|                                                                 |");
    console.log("|   The following arguments do not match doCode's command list:   |");
    console.log("|                                                                 |");
    for (var n=0; n<additionals.length; n++){
      var icns = ["😫","😱","❌","🙁","🤕"];
      var randomIcn = icns[Math.floor(icns.length * Math.random())];
      console.log("|     " + randomIcn + "  "  + clc.red(additionals[n]) + (" ".repeat(57-additionals[n].length)) + "|");
      console.log("|                                                                 |");
    }
  }
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
    var msg = " 😫  ☝️  😱  doCode Errors";
    say("|" + clc.red(msg) + (" ".repeat(67-msg.length)) + " |", mistakes);
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

  renderWebpage(20, source, target, function (err) {
    if (err){
      throw err;
    }

    var msg = " 📷  👍  💯  Yay! Screenshots were created successfully";
    say("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");
  });
}

function createGif(operations){
  imageMagicWarning();

  var source, target;
  target = currentFolder + '/_docode_temp/sketch.png';
  source = 'file:///' + currentFolder + '/index.html';

  var gifsource = 'file:///' + currentFolder + '/_docode_temp/*.png';

  renderWebpage(100, source, target, function (err) {
    if (err){
      throw err;
    }
    var msg = " 🖼  👍  💯  Yay! The Gif was created successfully";
    say("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");

    if(argv.interval){
      renderGif(gifsource, function (){
        // var msg = " 🌅 😔  GIF creation failed";
        // say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
      }, argv.interval);
    } else {
      renderGif(gifsource, function (){
        // var msg = " 🌅 😔  GIF creation failed";
        // say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
      });
    }

  });
}

function createVideo(operations){
  imageMagicWarning();

  var source, target;
  target = currentFolder + '/_docode_temp/sketch.png';
  source = 'file:///' + currentFolder + '/index.html';

  var gifsource = 'file:///' + currentFolder + '/_docode_temp/*.png';

  renderWebpage(1000, source, target, function (err) {
    if (err){
      throw err;
    }

    var msg = " 🎥  👍  💯  Yay! The video was created successfully";
    say("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");

    if(argv.interval){
      renderVideo(gifsource, function (){
        // var msg = " 🌅 😔  GIF creation failed";
        // say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
      }, argv.interval);
    } else {
      renderVideo(gifsource, function (){
        // var msg = " 🌅 😔  GIF creation failed";
        // say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
      });
    }

  });

}

function showHelp(operations){
  var msg = " 💡 😔  Preview is not supported yet";
  say("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
}

function renderWebpage (numOfImgs, source, target, cb) {
  var args = [renderer, source, target, numOfImgs];
  var child = spawn(phantomjs, args, { stdio: 'ignore' });

  // I really hate these next 3 lines...
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

function renderGif(source, cb, interval) {
  if(!interval){
    interval = 20;
  }

  var cmd = "mkdir docode_gif ; " + "convert -delay " + interval + " -loop 0 " + source + " " + currentFolder + '/docode_gif/sketch.gif';
  var child = exec(cmd, cb);

  child.on('error', cb);
  child.on('exit', function (code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function renderVideo(source, cb, interval) {
  // it will be easy to add more customizations by just adding additional args to this array
  if(!interval){
    interval = 0;
  }

  var cmd = "mkdir docode_video ; " + "convert -delay " + interval + " " + source + " " + currentFolder + "/docode_video/sketch.mp4";
  var child = exec(cmd, cb);
  child.on('error', cb);
  child.on('exit', function (code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
  // if(!interval){
  //   interval = 0;
  // }

  // var args = ["-delay", interval, "-loop 0", argv.input, argv.output];
  // var child = exec('convert', args);

  // child.on('error', cb);
  // child.on('exit', function (code) {
  //   if (code !== 0) {
  //     return cb(new Error('Bad exit code: ' + code));
  //   }
  //   cb(null);
  // });
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
