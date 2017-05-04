#!/usr/bin/env node
// yesno makes command-line dialogs a lot simpler
var yesno = require('yesno');
// we require in the module that we created, docode.
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

// pretty-prints the `message` and allows for an array of `additionals` which are treated as errors to be reported,.
function formattedOutput(message, additionals) {
  var clc = require('cli-color');

  if(message){
    console.warn("-------------------------------------------------------------------");
    console.warn(message);
  }
  if (additionals) {
    console.warn("-------------------------------------------------------------------");
    console.warn("|                                                                 |");
    console.warn("|   The following arguments do not match doCode's command list:   |");
    console.warn("|                                                                 |");
    var icns = ["😫", "😱", "❌", "🙁", "🤕"];
    var randomIcn = icns[Math.floor(icns.length * Math.random())];
    console.warn("|     " + randomIcn + "  " + clc.red(additionals) + (" ".repeat(57 - additionals.length)) + "|");
    console.warn("|                                                                 |");
  }
  console.warn("-------------------------------------------------------------------");
}

// This function is used to find the default browser used by the operating system
function getDefaultBrowser (){
  var browser;
  switch(process.platform){
    case 'darwin':
      var execSync = require('child_process').execSync;
      browser = execSync("grep 'https' -b3 ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist | head -2 | tail -1;").toString().replace(/[0-9]+-.*<string>/, "").replace("</string>", "").trim();

      // Then we return the string in a format that the `open` command will like
      switch(browser){
        case 'com.apple.safari':
          return("Safari");
        case 'com.google.chrome':
          return('Google Chrome');
        case 'com.mozilla.firefox':
          return("Firefox");
      }
      break;
    case 'freebsd':
      console.log('Sorry, preview has not yet been implemented for freebsd.');
      break;
    case 'linux':
      return("display");
      console.log('Sorry, preview has not yet been implemented for linux.');
      break;
    case 'sunos':
      console.log('Sorry, preview has not yet been implemented for sunos.');
      break;
    case 'win32':
      console.log('Sorry, preview has not yet been implemented for windows.');
      break;
  }
}

// Check if a file exists, run callback if it does and spit out some errors if it doesn't
// basically re-implements the fs.exists function which got deprecated from nod,e
function exists(filename, cb){
  var fs = require('fs');
  var clc = require('cli-color');

  fs.stat(filename, function(err, stat) {
    if(err == null) {
      cb();
    } else if(err.code == 'ENOENT') {
      // ENOENT == it does not exist
      var msg = " 🤔   Hmmm, it seems there's no `" + filename + "` here!";
      var msg2 = " 🤔   Are you sure you're in a p5 sketch folder?    ";
      formattedOutput("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
      formattedOutput("|" + clc.cyanBright(msg2) + (" ".repeat(63 - msg.length)) + " |");
      process.exit();
    } else {
      console.warn('Some other error: ', err.code);
    }
  });
}

// message to output when creating documentation in one of the `outputType`s is successfu,l
function success(outputType){
  var clc = require('cli-color');
  // this is where we'll store the message to output
  var msg;

  // storing the differet success messages here
  var gifMsg = " 🖼  👍  💯  Yay! The gif was created successfully";
  var videoMsg = " 📽  👍  💯  Yay! The video was created successfully!";
  var screenshotsMsg = " 🖼  👍  💯  Yay! The screenshots were created successfully!";

  // setting the `msg` based upon the outputType
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

  // outputting the formatted message using the msg as our text
  formattedOutput("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");
}

// Checks to see if commandName is available on the user's $PATH environment variable.
// If the command is not found, urlToCommandWebsite is provided to the user so they
// can download and install the dependency.
// example: checkDependency('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
function checkDependency(dependencyName, commandName, urlToCommandWebsite) {
  var clc = require('cli-color');
  var exec = require('child_process').exec;
  var isDependencyFound = exec("which " + commandName, function(err, res){
    if(err){
      var lineOne = '👉  Please make sure that you have ' + dependencyName + ' installed on you machine.';
      var url = urlToCommandWebsite;
      var lineTwo = '   To install ' + dependencyName + ' go to: ';
      var repeat = 85 - lineTwo.length - url.length;

      console.warn(clc.yellow("---------------------------------------------------------------------------------------"));
      console.warn(clc.yellow("| ") + lineOne + (" ".repeat(86 - lineOne.length)) + clc.yellow("|"));
      console.warn(clc.yellow("| ") + lineTwo + clc.cyan(url) + (" ".repeat(repeat)) + clc.yellow("|"));
      console.warn(clc.yellow("---------------------------------------------------------------------------------------"));
      return false;
    }
  });
      return true;
}

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
    success("screenshots");
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
    success("gif");
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
    switch(process.platform){
        case "darwin":
          var open = require("open");
    // Sets the default browser to something that is appropriate to pass to `open`
          var defaultBrowser = getDefaultBrowser();

          success("video");
          console.warn('🌎  Trying to preview the video using Google Chrome.');
          open(videoFile, defaultBrowser);
          break;
        case "linux":
          if(checkDependency("xdg-open", "xdg-open", "")){
            execSync("xdg-open " + videoFile);
          } else if(checkDependency("mplayer", "mplayer", "")){
            execSync("mplayer " + "mplayer", "");
          } else if(checkDependency("vlc", "vlc", "")){
            execSync("vlc " + videoFile);
          } else if(checkDependency("chrome", "chrome", "")){
            execSync("chrome " + videoFile);
          }
          break;
    }
    if(quiet){
      console.log(videoFile);
    } else {
      success("video");
    }
  }

  exec("rm -fr docode/_temp");
}

// MAIN SECTION
// We need these, so we check for them and if not we help them to find them
checkDependency('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
checkDependency('FFMpeg', 'ffmpeg', 'http://ffmpeg.org/download.html');

// yargonaut gives us a little more control over the styling of the CLI
var yargonaut = require('yargonaut')
    .helpStyle('green')
    .style('blue');

// Yargs is a very lightweight framework for creating command-line applications with Node
// Here is where we definte the structure of docode's user interface
var yargs = require('yargs')
    .showHelpOnFail(false, "Specify --help for available options")
    .usage('Usage: $0 <cmd> [options]\n\nAll parameters are optional.\n\nRunning `docode` without any parameters defaults to generating all forms of documentation (screenshots, gif, video).\n\nOptions in square brackets can be set from the command-line by putting a double-dash in front of the option name.\n\nExamples:\n`docode screenshots --total=20` => Creates 20 screenshots with all other settings using the defaults.\n`docode video --length=5 --preview` => Creates a 5 second mp4 and opens the new video when finished.\n\nFor more information about these options, refer to the README')
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
      exists('index.html', function() {
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
        default: 2
      }
    }, function(argv){
      exists('index.html', function() {
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
               exists('index.html', function() {
                 makeVideo(argv.lengthInSeconds, argv.interval, argv.preview, argv.quiet, argv.input, argv.output);
               });
             })
    .command('clean', 'Removes all docode files from sketch.', {}, function(argv){
      var exec = require('child_process').exec;
      exists('docode', function() {
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
// If no arguments are provided, generated all forms of documentation using the defaults.
if(yargs.argv._.length === 0){
  exists('index.html', function() {
    makeScreenshots(100, 6, false);
    makeGif(100, 20, false);
    makeVideo(10, 5, false, false, docodeFolder + '/video/' + sketchFolderName + '.mp4', sketchFolder + '/index.html');
  });
} else if (cmd !== 'gif' && cmd !== 'video' && cmd !== 'clean' && cmd !== 'screenshots' && cmd !== 'help') {
  formattedOutput(undefined,cmd);
}
