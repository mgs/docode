#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var renderer = path.join(__dirname, 'renderer.js');

var currentFolder = process.cwd();
var filenameArray = [];
var names = currentFolder.split("/");
var sketchFolderName = names[names.length - 1];
var docodePath = "";
for (var i = 0; i < names.length - 1; i++) {
  docodePath = docodePath + "/" + names[i];
}

function imageMagicWarning() {
  var isImageMagickFound = exec("which convert", function(err, res){
    if(err){
      var lineOne = '👉  Please make sure that you have ImageMagick installed on you machine.';
      var url = 'https://www.imagemagick.org/script/download.php';
      var lineTwo = '   To install ImageMagick go to: ';
      var repeat = 85 - lineTwo.length - url.length;
      //  + clc.cyan(url);

      console.log(clc.yellow("\n---------------------------------------------------------------------------------------"));
      console.warn(clc.yellow("| ") + lineOne + (" ".repeat(86 - lineOne.length)) + clc.yellow("|"));
      console.warn(clc.yellow("| ") + lineTwo + clc.cyan(url) + (" ".repeat(repeat)) + clc.yellow("|"));
      console.log(clc.yellow("---------------------------------------------------------------------------------------\n"));
    }
  });
}


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
        target = currentFolder + '/docode_screenshots/sketch.png';
        source = 'file:///' + currentFolder + '/index.html';

        exec("rm -fr docode_screenshots; mkdir docode_screenshots;");

        renderWebpage(numberOfScreenshots, source, target, function(err) {
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
      imageMagicWarning();
      var source, target;

      exec("rm -fr docode_gif; mkdir docode_gif; mkdir _docode_temp;");

      target = currentFolder + '/_docode_temp/sketch.png';
      source = 'file:///' + currentFolder + '/index.html';

        renderWebpage(numberOfScreenshots, source, target, function(err) {
        if (err) {
          throw err;
        }
        var msg = " 🖼  👍  💯  Yay! The Gif was created successfully";
        say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");

        var gifsource = 'file:///' + currentFolder + '/_docode_temp/*.png';

        if (argv.interval) {
          renderGif(sketchFolderName, gifsource, function() {
            exec("rm -fr _docode_temp");
          }, interval);
        } else {
          renderGif(sketchFolderName, gifsource, function() {
            exec("rm -fr _docode_temp");
          });
        }
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
      imageMagicWarning();
      exec("rm -fr docode_video; mkdir _docode_temp; mkdir docode_video;");
      console.log("🎬  Generating video...");
      var source, target;
      target = currentFolder + '/_docode_temp/sketch.png';
      source = 'file:///' + currentFolder + '/index.html';
      var videoSource = 'file:///' + currentFolder + '/_docode_temp/*.png';

      renderWebpage(length*24, source, target, function(err) {
        if (err) {
          throw err;
        } else {
           var msg = " 📽  👍  💯  Yay! The video was created successfully";
           say("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");

      if (interval) {
        renderVideo(sketchFolderName, videoSource, function() {
          var videoFile = 'file:///' + currentFolder + '/docode_video/' + sketchFolderName + '.mp4';
          console.log('🌎  Trying to preview the video using Google Chrome.');
          exec("rm -fr _docode_temp");
          var open = require("open");
          open(videoFile, "google chrome");
        }, interval);
      } else {
        renderVideo(sketchFolderName, videoSource, function() {
          var videoFile = 'file:///' + currentFolder + '/docode_video/' + sketchFolderName + '.mp4';
          console.log('🌎  Trying to preview the video using Google Chrome.');
          exec("rm -fr _docode_temp");
          var open = require("open");
          open(videoFile, "google chrome");
        });
      }
        }
      });
    }
  });
}  

function showHelp(operations) {
  var msg = " 💡 😔  Preview is not supported yet";
  say("|" + clc.cyan(msg) + (" ".repeat(66 - msg.length)) + " |");
}

function renderWebpage(numOfImgs, source, target, cb) {
  var args = [renderer, source, target, numOfImgs];
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
  if (!interval) {
    interval = 20;
  }

  var cmd = "convert -delay " + interval + " -loop 0 " + source + " " + currentFolder + '/docode_gif/sketch.gif';
  var child = exec(cmd, cb);

  child.on('error', cb);
  child.on('exit', function(code) {
    if (code !== 0) {
      return cb(new Error('Bad exit code: ' + code));
    }
    cb(null);
  });
}

function renderVideo(name, source, cb, interval) {
  // it will be easy to add more customizations by just adding additional args to this array
  if (!interval) {
    interval = 0;
  }

  var cmd = "ffmpeg -framerate 24 -i _docode_temp/%*.png docode_video/" + name + ".mp4";
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
        default: 20
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
    .command('clean [confirm]', 'Removes all doCode files from sketch.\nTo confirm pass argument: `true`', {
      confirm: {
        default: false
      }
    }, function(argv){
      if(argv.confirm){
        exec("rm -fr _docode_temp docode_screenshots docode_gif docode_video;");
      } else {
        console.log("Run again with an additional argument of 'true' to confirm that you really want to delete all doCode files");
      }
    })
    .help('help');

var argv = yargs.argv;

if(argv._.length === 0) yargs.showHelp();
