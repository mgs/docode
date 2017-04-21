#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var yesno = require('yesno');
var renderer = path.join(__dirname, 'renderer.js');

var timeStamp = new Date();
var _uuid = "-" + timeStamp.getMonth() + '-' + timeStamp.getDay() + '-' + timeStamp.getYear().toString().slice(1,3) + '-' + timeStamp.getHours() + '-' + timeStamp.getMinutes() + '-' + timeStamp.getSeconds();

var sketchFolder = process.cwd();
var currentFolder = sketchFolder + "/docode";
var docodeFolder = sketchFolder + "/docode";

var filenameArray = [];

function getDefaultBrowser(){
  browser = (execSync("grep 'https' -b3 ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist | head -2 | tail -1;").toString().replace(/[0-9]+-.*<string>/, "").replace("</string>", "").trim());
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
function warnIfNotFound(dependencyName, commandName, urlToCommandWebsite) {
  var isDependencyFound = exec("which " + commandName, function(err, res){
    if(err){
      var lineOne = '👉  Please make sure that you have ' + dependencyName + ' installed on you machine.';
      var url = urlToCommandWebsite;
      var lineTwo = '   To install ' + dependencyName + ' go to: ';
      var repeat = 85 - lineTwo.length - url.length;
      //  + clc.cyan(url);

      console.log(clc.yellow("\n---------------------------------------------------------------------------------------"));
      console.warn(clc.yellow("| ") + lineOne + (" ".repeat(86 - lineOne.length)) + clc.yellow("|"));
      console.warn(clc.yellow("| ") + lineTwo + clc.cyan(url) + (" ".repeat(repeat)) + clc.yellow("|"));
      console.log(clc.yellow("---------------------------------------------------------------------------------------\n"));
    }
  });
}

warnIfNotFound('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
warnIfNotFound('FFMpeg', 'ffmpeg', 'http://ffmpeg.org/download.html');

function say(message, additionals) {
  if(message){
    console.log(" ");
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
  fs.readFile('index.html', function(err) {
    if(err) {
      var msg = " 🤔   hmmm, it seems there's not an index.html file here !";
      say("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
      return;
    } else {
        var source, target;
      target = docodeFolder + '/screenshots/' + _uuid.slice(1) + '/sketch.png';
      source = sketchFolder + '/index.html';

        exec("mkdir docode; cd docode; rm -fr _temp; mkdir screenshots;");

      renderScreenshots(numberOfScreenshots, source, target, interval, function(err) {
          if (err) {
            throw err;
          }
          var msg = " 🖼  👍  💯  Yay! The screenshots were created successfully!";
          say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");
        });
      }
  });
}

function makeGif(numberOfScreenshots, interval){
  fs.readFile('index.html', function(err) {
    if(err) {
      var msg = " 🤔   hmmm, it seems there's not an index.html file here !";
      say("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
      return;
    } else {
      var source, target;

      exec("mkdir docode; cd docode; mkdir gif; rm -fr _temp; mkdir _temp;");

      target = docodeFolder + '/_temp/sketch.png';
      source = sketchFolder + '/index.html';
      
      renderScreenshots(numberOfScreenshots, source, target, interval, function(err) {
        if (err) {
          throw err;
        }
        var msg = " 🖼  👍  💯  Yay! The Gif was created successfully";
        say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");

        var gifsource = docodeFolder + '/_temp/*.png';

        renderGif(sketchFolderName, gifsource, function() {
          exec("rm -fr docode/_temp");
        }, interval);
      });
    }
  });
}

function makeVideo(length, interval){
  fs.readFile('index.html', function(err) {
    if(err) {
      var msg = " 🤔   hmmm, it seems there's not an index.html file here !";
      say("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
      return;
    } else {
      exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/video;");
      console.log("🎬  Generating video...");
      var source, target;
      target = docodeFolder + '/_temp/sketch.png';
      source = sketchFolder + '/index.html';
      var videoSource = "'docode/_temp/*.png'";

      renderScreenshots(length*24, source, target, interval, function(err, res) {
        if (err) {
          console.log(err,res);
          throw err;
        } else {
          console.log(err,res);
          var msg = " 📽  👍  💯  Yay! The video was created successfully";
          say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");

          renderVideo(sketchFolderName, videoSource, interval, function() {
            var videoFile = docodeFolder + '/video/' + sketchFolderName + '.mp4';
            console.log('🌎  Trying to preview the video using Google Chrome.');
            exec("rm -fr docode/_temp");
            var open = require("open");
            open(videoFile, defaultBrowser);
          });
        }
      });
    }
  });
}  

function showHelp(operations) {
  var msg = " 💡 😔  Preview is not supported yet";
  say("|" + clc.cyan(msg) + (" ".repeat(66 - msg.length)) + " |");
}

function renderScreenshots(numOfImgs, source, target, interval, cb) {
  var args = [renderer, source, target, numOfImgs, interval];
  var child = spawn(phantomjs, args, {
    stdio: 'ignore'
  });

  // I really hate these next 3 lines...
  for (var i = 0; i < numOfImgs; i++) {
    filenameArray.push("sketch" + i + ".png");
  }

  child.on('error', cb);
  child.on('exit', function(code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function renderGif(name, source, cb, interval) {
  var cmd = "convert -delay " + interval + " -loop 0 " + source + " " + docodeFolder + '/gif/' + sketchFolderName + '.gif';
  var child = exec(cmd, cb);

  child.on('error', cb);
  child.on('exit', function(code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function renderVideo(name, source, interval, cb) {
  var cmd = "ffmpeg -framerate 24 -pattern_type sequence -i 'docode/_temp/sketch%02d.png' -f mp4 -c:v libx264 -pix_fmt yuv420p docode/video/" + sketchFolderName + ".mp4";
  console.log(cmd);
  var child = exec(cmd, cb);

  child.on('error', cb);
  child.on('exit', function(code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
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
      makeScreenshots(argv.screenshotTotal, argv.interval);
    })
    .command('gif [screenshotTotal] [interval]', 'generates an animated gif', {
      screenshotTotal: {
        default: 100
      },
      interval: {
        default: 20
      }
    }, function(argv){
      makeGif(argv.screenshotTotal, argv.interval);
    })
    .command('video [lengthInSeconds] [interval]', 'generates an mp4 video of the sketch.', {
      lengthInSeconds: {
        default: 20
      },
      interval: {
        default: 5
      }
    }, function(argv){
      makeVideo(argv.lengthInSeconds, argv.interval);
    })
    .command('clean', 'Removes all docode files from sketch.', {}, function(argv){
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
    })
    .help('help');

var argv = yargs.argv;

if(argv._.length === 0) yargs.showHelp();
