#!/usr/bin/env node

var os = require('os');
var path = require('path');
// var fs = require('fs');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var renderer = path.join(__dirname, 'renderer.js');
var argv = require('yargs')
    .usage('Usage: $0 --screenshots=<sketchFolder> [options]')
    .example('$0 --screenshots=<sketchFolder>', 'Create documentation assets for the p5 sketch in <sketchFolder>')
    .alias('s', 'screenshots')
    .nargs('s')
    .describe('s', 'Specifies the sketch folder to compile into docs.')
    .alias('g', 'gif')
    .nargs('g')
    .describe('g', 'Create an animated gif of the specified sketch.')
    .alias('v', 'video')
    .nargs('v')
    .describe('v', 'Output an mp4 video of the specified sketch.')
    .alias('p', 'preview')
    .nargs('p')
    .describe('p', 'Shows an ascii preview of the sketch in the terminal.')
    // .demandOption(['s'])
    .help('h')
    .alias('h', 'help')
    .argv;

var currentFolder = process.cwd();
var fileNameArray = [];

var operations = {
  screenshots: createScreenshots,
  s: createScreenshots,
  video: createVideo,
  v: createVideo,
  gif: createGif,
  g: createGif,
  preview: showPreview,
  p: showPreview,
  help: showHelp,
  h: showHelp
};

function main (args){

  console.log('args:');
  console.log(args);
  for (var n in args){
    // console.log(n +  ' ' + operations.hasOwnProperty(n));
    // console.log(n !== '_');
    if (operations.hasOwnProperty(n)){
      // console.log('checking:');
      // console.log(typeof(args[n]));
      if (args[n] !== undefined && args[n] !== false) {
        // console.log('passed!');
        // console.log(':');
        // console.log(typeof(args[n]));
        console.log('executing ' + n);
        operations[n]();
      }
    }
    // else {
    //   if (n !== "$0" && n !== "_"){
    //     syntaxError = true;
    //     mistakes.push(args._[n]);
    //     console.log('added ' + args._[n] + ' to mistakes');
    //   }
      // console.log(args._);
      // console.log(n +  ' ' + operations.hasOwnProperty(n));
      // console.log(args._[n]);
      // console.log(args._);
      // console.log(args.s);
      // syntaxError = true;
      // mistakes.push(args._[n]);

  } // end for

} // end main

function reportErrors(args){

  var syntaxError = false;
  var mistakes = [];

  console.log('errors ' + args._.length);
  if (args._.length > 0){
    syntaxError = true;
    for (var i=0; i<args._.length; i++){
      mistakes.push(args._[i]);
      console.log('added ' + args._[i] + ' to mistakes');
    }
  }
  console.log(mistakes);

  if (syntaxError === true){
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
}

function createScreenshots(operations){
  var target;

  if (argv.screenshots){
    if (argv.screenshots !== 'boolean'){
      target = currentFolder + '/docode_screenshots/sketch.png';
    } else {
      argv.screenshots = argv.screenshots.replace('~', os.homedir());
      target = argv.screenshots + '/docode_screenshots/sketch.png';
    }
  } else {
    if (argv.s !== 'boolean'){
      target = currentFolder + '/docode_screenshots/sketch.png';
    } else {
      argv.s = argv.s.replace('~', os.homedir());
      target = argv.screenshots + '/docode_screenshots/sketch.png';
    }
  }

  console.log(target);
  console.log(process.cwd());
  renderWebpage('file:///' + currentFolder + '/index.html', target, function (err) {
    if (err){
      throw err;
    }

    // console.log('Success!');
    var msg = " 🖼  👍  Screenshots were created successfully";
    console.log(" ");
    console.log("-------------------------------------------------------------------");
    console.log("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");
    console.log("-------------------------------------------------------------------");
    console.log(" ");
  });
}


function createVideo(operations){
  var msg = " 📹 😔  Video creation is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function createGif(operations){
  var msg = " 🌅 😔  GIF creation is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function showPreview(operations){
  var msg = " ☠️ 😔  Preview is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function showHelp(operations){
  var msg = " 💡 😔  Preview is not supported yet";
  console.log("                                                                   ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log("                                                                   ");
}

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


main(argv);
reportErrors(argv);

// if (isErrors === false){
//   executeCommands(operations);
// }
