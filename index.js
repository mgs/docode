#!/usr/bin/env node
var os = require('os');
var yesno = require('yesno');
var docode = require('./docode.js').docode;

// These variables are helpers for later on when we want to timestamp
var currentTime = new Date();
var timeStamp = "-" + (currentTime.getMonth()+1) + '-' + currentTime.getDate() + '-' + currentTime.getFullYear() + '-' + currentTime.getHours() + '-' + currentTime.getMinutes() + '-' + currentTime.getSeconds();

// More helper variables for accessing the path 
var sketchFolder = process.cwd();
var docodeFolder = sketchFolder + "/docode";

// To get the sketchFolderName we have to pick apart the path by splitting it on the '/'
var _sketchPath = sketchFolder.split("/");

// We can find the sketch's folder name then by looking at the last member of the split
// we then append the timeStamp to make this sketch unique.
var sketchFolderName = _sketchPath[_sketchPath.length - 1] + timeStamp;

// Make Functions
// These are the higher level functions that comprise the API of docode,

function makeScreenshots(numberOfScreenshots, interval, quiet){
  var exec = require('child_process').exec;

  // Ensure that docode and screenshots directory exist, delete and recreate the temp dir
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/screenshots;");

  var target = docodeFolder + '/screenshots/' + timeStamp.slice(1) + '/' + sketchFolderName + '.png';
  var source = sketchFolder + '/index.html';

  if(!quiet){
    console.warn("🎬  Generating " + numberOfScreenshots + " screenshots.");
  }
  
  // create screenshots in a timestamped folder
  docode.renderScreenshots(numberOfScreenshots, source, target, interval);
  var screenshotsFile = docodeFolder + '/screenshots/' + sketchFolderName + '/';
  
  // delete the temp files
  exec("rm -fr docode/_temp");

  if(quiet){
    console.log(screenshotsFile);
  } else {
    docode.success("screenshots");
  }
}

function makeGif(numberOfScreenshots, interval, quiet){
  var exec = require('child_process').exec;
  // Ensure that docode and gif directory exist, delete and recreate the temp dir
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/gif;");
  if(!quiet){
    console.warn("🎬  Generating animated gif.");
  }
  
  var gifsource = docodeFolder + '/_temp/*.png';
  var target = docodeFolder + '/_temp/sketch.png';
  var source = sketchFolder + '/index.html';
  var gifTarget = docodeFolder+ '/gif/' + sketchFolderName + '.gif';

  // create screenshots to use for making the gif
  docode.renderScreenshots(numberOfScreenshots, source, target, interval);
  // make the gif using the screenshots
  docode.renderGif(sketchFolderName, gifsource, gifTarget, interval);

  // delete the temp files
  exec("rm -fr docode/_temp");
  
  if(quiet){
    // In quiet Mode, Only output the path to the new file
    console.log(docodeFolder + '/gif/' + sketchFolderName + '.gif');
  } else {
    docode.success("gif");
  }
}

function makeVideo(length, interval, preview, quiet, pathToSketchIndexHtml, pathToVideoOutputFile){
  var exec = require('child_process').exec;
  exec("mkdir docode; rm -fr docode/_temp; mkdir docode/_temp; mkdir docode/video;");
  if(!quiet){
    console.warn("🎬  Generating video...");
  }
  var target = docodeFolder + '/_temp/sketch.png';
  var videoSource = "'docode/_temp/*.png'";
  var videoFile = pathToVideoOutputFile;

  docode.renderScreenshots(length*24, pathToSketchIndexHtml, target, interval);
  docode.renderVideo(sketchFolderName, videoSource, sketchFolderName, interval);
  
  if(preview){
    var open = require("open");
    // Sets the default browser to something that is appropriate to pass to `open`
    var defaultBrowser = docode.getDefaultBrowser();

    docode.success("video");
    console.warn('🌎  Trying to preview the video using Google Chrome.');
    open(videoFile, defaultBrowser);
  } else {
    if(quiet){
      console.log(videoFile);
    } else {
      docode.success("video");
    }
  }

  exec("rm -fr docode/_temp");
}

// MAIN SECTION
// We need these, so we check for them and if not we help them to find them
docode.checkDependency('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
docode.checkDependency('FFMpeg', 'ffmpeg', 'http://ffmpeg.org/download.html');

// Yargs is a very lightweight framework for creating command-line applications with Node
// Here is where we definte the structure of docode's user interface
var yargs = require('yargs')
    .showHelpOnFail(false, "Specify --help for available options")
    .usage('Usage: $0 <cmd> [options]\n\nAll parameters are optional.\n\nRunning `docode` without any parameters defaults to generating all forms of documentation (screenshots, gif, video).\n\nOptions in square brackets can be set from the command-line by putting a double-dash in front of the option name.\n\nFor example: `docode screenshots --total=20`\n\nThis would result in docode creating 20 screenshots with all other settings using the defaults. For more information about these options, refer to the README')
    .command('screenshots [total] [interval] [quiet]', 'generate screenshots.', {
      total: {
        default: 100
      },
      quiet: {
        default: false
      },
      interval: {
        default: 6
      }
    }, function(argv){
      docode.exists('index.html', function() {
        makeScreenshots(argv.total, argv.interval, argv.quiet);
      });
    })
    .command('gif [frames] [interval] [quiet]', 'generates an animated gif', {
      frames: {
        default: 100
      },
      quiet: {
        default: false
      },
      interval: {
        default: 20
      }
    }, function(argv){
      docode.exists('index.html', function() {
        makeGif(argv.frames, argv.interval, argv.quiet);
      });
    })
    .command('video [length] [interval] [preview] [quiet] [input] [output]',
             'generates an mp4 video of the sketch.', {
      lengthInSeconds: {
        default: 10
      },
      quiet: {
        default: false
      },
      interval: {
        default: 5
      },
      preview: {
        default: false
      },
      input: {
        default: sketchFolder + '/index.html'
      },
      output: {
        default: docodeFolder + '/video/' + sketchFolderName + '.mp4'
      }

    }, function(argv){
      docode.exists('index.html', function() {
        makeVideo(argv.lengthInSeconds, argv.interval, argv.preview, argv.quiet, argv.input, argv.output);
      });
    })
    .command('clean', 'Removes all docode files from sketch.', {}, function(argv){
      var exec = require('child_process').exec;
      docode.exists('docode', function() {
        yesno.ask('Are you sure you want to delete all docode files for this sketch?', true, function(ok) {
          if(ok) {
            console.warn("docode folder deleted.");
            exec("rm -fr docode");
            process.exit();
          } else {
            console.warn("Keeping docode folder.");
            process.exit();
          }
        });
      });
    })
    .help('help');

// Wrap text at the max width for the current terminal
yargs.wrap(yargs.terminalWidth());

var cmd = yargs.argv._[0];
// If no arguments are provided, throw the help screen at the user
if(yargs.argv._.length === 0){
  docode.exists('index.html', function() {
    makeScreenshots(100, 6, false);
    makeGif(100, 20, false);
    makeVideo(10, 5, false, false, docodeFolder + '/video/' + sketchFolderName + '.mp4', sketchFolder + '/index.html');
  });
} else if (cmd !== 'gif' && cmd !== 'video' && cmd !== 'clean' && cmd !== 'screenshots' && cmd !== 'help') {
  console.log("Sorry, '" + cmd + "' is not an available command. Try `docode help`.");
}

