#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var yesno = require('yesno');
var renderer = path.join(__dirname, 'renderer.js');

var timeStamp = new Date();
var _uuid = "-" + timeStamp.getMonth() + '-' + timeStamp.getDay() + '-' + timeStamp.getYear().toString().slice(1,3) + '-' + timeStamp.getHours() + '-' + timeStamp.getMinutes() + '-' + timeStamp.getSeconds();

var sketchFolder = process.cwd();
var currentFolder = sketchFolder + "/docode";
var docodeFolder = sketchFolder + "/docode";

function getDefaultBrowser(){
  var browser = execSync("grep 'https' -b3 ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist | head -2 | tail -1;").toString().replace(/[0-9]+-.*<string>/, "").replace("</string>", "").trim();
  switch(browser){
    case 'com.apple.safari':
      return("Safari");
      break;
    case 'com.google.chrome':
      return('Google Chrome');
      break;
    case 'com.mozilla.firefox':
      return("Firefox");
      break;
  }
}
var defaultBrowser = getDefaultBrowser();

var names = sketchFolder.split("/");
var sketchFolderName = names[names.length - 1] + _uuid;

var docodePath = "";
for (var i = 0; i < names.length - 1; i++) {
  docodePath = docodePath + "/" + names[i];
}

// more general dependency checker
function checkDependency(dependencyName, commandName, urlToCommandWebsite) {
  var isDependencyFound = exec("which " + commandName, function(err, res){
    if(err){
      var lineOne = '👉  Please make sure that you have ' + dependencyName + ' installed on you machine.';
      var url = urlToCommandWebsite;
      var lineTwo = '   To install ' + dependencyName + ' go to: ';
      var repeat = 85 - lineTwo.length - url.length;

      console.log(clc.yellow("---------------------------------------------------------------------------------------"));
      console.warn(clc.yellow("| ") + lineOne + (" ".repeat(86 - lineOne.length)) + clc.yellow("|"));
      console.warn(clc.yellow("| ") + lineTwo + clc.cyan(url) + (" ".repeat(repeat)) + clc.yellow("|"));
      console.log(clc.yellow("---------------------------------------------------------------------------------------"));
    }
  });
}

checkDependency('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
checkDependency('FFMpeg', 'ffmpeg', 'http://ffmpeg.org/download.html');

function say(message, additionals) {
  if(message){
    //console.log(" ");
    console.log("-------------------------------------------------------------------");
    console.log(message);
  }
  if (additionals) {
    console.log("-------------------------------------------------------------------");
    console.log("|                                                                 |");
    console.log("|   The following arguments do not match doCode's command list:   |");
    console.log("|                                                                 |");
    for (var n = 0; n < additionals.length; n++) {
      var icns = ["😫", "😱", "❌", "🙁", "🤕"];
      var randomIcn = icns[Math.floor(icns.length * Math.random())];
      console.log("|     " + randomIcn + "  " + clc.red(additionals[n]) + (" ".repeat(57 - additionals[n].length)) + "|");
      console.log("|                                                                 |");
    }
  }
  console.log("-------------------------------------------------------------------");
}

function makeScreenshots(numberOfScreenshots, interval){
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/screenshots;");

  var target = docodeFolder + '/screenshots/' + _uuid.slice(1) + '/sketch.png';
  var source = sketchFolder + '/index.html';

  console.log("🎬  Generating screenshots...");

  renderScreenshots(numberOfScreenshots, source, target, interval);
  success("screenshots");
}

function makeGif(numberOfScreenshots, interval){
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/gif;");
  
  var gifsource = docodeFolder + '/_temp/*.png';
  var target = docodeFolder + '/_temp/sketch.png';
  var source = sketchFolder + '/index.html';
  console.log("🎬  Generating animated gif...");

  renderScreenshots(numberOfScreenshots, source, target, interval);
  renderGif(sketchFolderName, gifsource, interval);
  exec("rm -fr docode/_temp");
  success("gif");
}

function exists(filename, cb){
  fs.stat(filename, function(err, stat) {
    if(err == null) {
      cb();
    } else if(err.code == 'ENOENT') {
      // ENOENT == it does not exist
      var msg = " 🤔   Hmmm, it seems there's no `" + filename + "` here!";
      var msg2 = " 🤔   Are you sure you're in a p5 sketch folder?";
      say("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
      say("|" + clc.cyanBright(msg2) + (" ".repeat(63 - msg.length)) + " |");
      process.exit();
    } else {
      console.log('Some other error: ', err.code);
    }
  });
}

function success(outputType){
  var gifMsg = " 🖼  👍  💯  Yay! The gif was created successfully";
  var videoMsg = " 📽  👍  💯  Yay! The video was created successfully!";
  var screenshotsMsg = " 🖼  👍  💯  Yay! The screenshots were created successfully!";
  
  switch(outputType){
    case 'gif':
      msg = gifMsg;
      break;
    case 'video':
      msg = videoMsg;
      break;
    case 'screenshots':
      msg = screenshotsMsg;
      break;
  }
  say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");
}

function makeVideo(length, interval, preview){
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/video;");
  console.log("🎬  Generating video...");
  var source, target;
  target = docodeFolder + '/_temp/sketch.png';
  source = sketchFolder + '/index.html';
  var videoSource = "'docode/_temp/*.png'";

  renderScreenshots(length*24, source, target, interval);
  renderVideo(sketchFolderName, videoSource, interval);
  
  var videoFile = docodeFolder + '/video/' + sketchFolderName + '.mp4';
  if(preview){
    console.log('🌎  Trying to preview the video using Google Chrome.');
    var open = require("open");
    open(videoFile, defaultBrowser);
  }

  success("video");
  exec("rm -fr docode/_temp");
}

function renderScreenshots(numOfImgs, source, target, interval) {
  var args = [renderer, source, target, numOfImgs, interval];
  spawnSync(phantomjs, args, {stdio: 'ignore'});
}

function renderGif(name, source, interval) {
  var cmd = "convert -delay " + interval + " -loop 0 " + source + " " + docodeFolder + '/gif/' + sketchFolderName + '.gif';
  execSync(cmd, { stdio: 'ignore' });
}

function renderVideo(name, source, interval) {
  var cmd = "ffmpeg -framerate 24 -pattern_type sequence -i 'docode/_temp/sketch%02d.png' -f mp4 -c:v libx264 -pix_fmt yuv420p docode/video/" + sketchFolderName + ".mp4";
  execSync(cmd, { stdio: 'ignore' });
}

var yargs = require('yargs')
    .showHelpOnFail(false, "Specify --help for available options")
    .usage('Usage: $0 <cmd> [options]')
    .command('screenshots [screenshotTotal] [interval]', 'generates a series of screenshots.', {
      screenshotTotal: {
        default: 100
      },
      interval: {
        default: 6
      }
    }, function(argv){
      exists('index.html', function() {
        makeScreenshots(argv.screenshotTotal, argv.interval);
      });
    })
    .command('gif [screenshotTotal] [interval]', 'generates an animated gif', {
      screenshotTotal: {
        default: 100
      },
      interval: {
        default: 20
      }
    }, function(argv){
      exists('index.html', function() {
        makeGif(argv.screenshotTotal, argv.interval);
      });
    })
    .command('video [lengthInSeconds] [interval] [preview]', 'generates an mp4 video of the sketch.', {
      lengthInSeconds: {
        default: 20
      },
      interval: {
        default: 5
      },
      preview: {
        default: false
      }

    }, function(argv){
      exists('index.html', function() {
        makeVideo(argv.lengthInSeconds, argv.interval, argv.preview);
      });
    })
    .command('clean', 'Removes all docode files from sketch.', {}, function(argv){
      exists('docode', function() {
        yesno.ask('Are you sure you want to delete all docode files for this sketch?', true, function(ok) {
          if(ok) {
            console.log("docode folder deleted.");
            exec("rm -fr docode");
            process.exit();
          } else {
            console.log("Keeping docode folder.");
            process.exit();
          }
        });
      });
    })
    .help('help');

yargs.wrap(yargs.terminalWidth());

if(yargs.argv._.length === 0) yargs.showHelp();
