var docode = {
  // This function is used to find the default browser used by the
  // operating system and then launching that browser for previews
  getDefaultBrowser: function (){
    var browser;
    switch(process.platform){
      case 'darwin':
        var execSync = require('child_process').execSync;
        browser = execSync("grep 'https' -b3 ~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist | head -2 | tail -1;").toString().replace(/[0-9]+-.*<string>/, "").replace("</string>", "").trim();
        // Then we return the string that the open command is looking for
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
        console.log('Sorry, preview has not yet been implemented for freebsd.');
        break;
      case 'sunos':
        console.log('Sorry, preview has not yet been implemented for sunos.');
        break;
      case 'win32':
        console.log('Sorry, preview has not yet been implemented for windows.');
        break;
    }
  },

  // Check if a file exists, run callback if it does and spit out some errors if it doesn't
  // basically re-implements the fs.exists function which got deprecated from nod,e
  exists: function(filename, cb){
    var fs = require('fs');
    var clc = require('cli-color');

    fs.stat(filename, function(err, stat) {
      if(err == null) {
        cb();
      } else if(err.code == 'ENOENT') {
        // ENOENT == it does not exist
        var msg = " 🤔   Hmmm, it seems there's no `" + filename + "` here!";
        var msg2 = " 🤔   Are you sure you're in a p5 sketch folder?";
        this.formattedOutput("|" + clc.cyanBright(msg) + (" ".repeat(65 - msg.length)) + " |");
        this.formattedOutput("|" + clc.cyanBright(msg2) + (" ".repeat(63 - msg.length)) + " |");
        process.exit();
      } else {
        console.warn('Some other error: ', err.code);
      }
    });
  },

  // message to output when creating documentation in one of the `outputType`s is successfu,l
  success: function(outputType){
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
    this.formattedOutput("|" + clc.cyanBright(msg) + (" ".repeat(66 - msg.length)) + "  |");
  },

  // Checks to see if commandName is available on the user's $PATH environment variable.
  // If the command is not found, urlToCommandWebsite is provided to the user so they
  // can download and install the dependency.
  // example: checkDependency('ImageMagick', 'convert', 'https://www.imagemagick.org/script/download.php');
  checkDependency: function(dependencyName, commandName, urlToCommandWebsite) {
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
      }
    });
  },

  // pretty-prints the `message` and allows for an array of `additionals` which are treated as errors to be reported,.
  formattedOutput: function(message, additionals) {
    var clc = require('cli-color');

    if(message){
      //console.warn(" ");
      console.warn("-------------------------------------------------------------------");
      console.warn(message);
    }
    if (additionals) {
      console.warn("-------------------------------------------------------------------");
      console.warn("|                                                                 |");
      console.warn("|   The following arguments do not match doCode's command list:   |");
      console.warn("|                                                                 |");
      for (var n = 0; n < additionals.length; n++) {
        var icns = ["😫", "😱", "❌", "🙁", "🤕"];
        var randomIcn = icns[Math.floor(icns.length * Math.random())];
        console.warn("|     " + randomIcn + "  " + clc.red(additionals[n]) + (" ".repeat(57 - additionals[n].length)) + "|");
        console.warn("|                                                                 |");
      }
    }
    console.warn("-------------------------------------------------------------------");
  },

  // The render functions are the lower level functions that  execute the shell commands related to each tas,k
  renderScreenshots: function(numOfImgs, source, target, interval) {
    var path = require('path');
    var renderer = path.join(__dirname, 'renderer.js');
    var spawnSync = require('child_process').spawnSync;
    var args = [renderer, source, target, numOfImgs, interval];
    var phantomjs = require('phantomjs2').path;
    var spawnSync = require('child_process').spawnSync;

    spawnSync(phantomjs, args, {stdio: 'ignore'});
  },

  renderGif: function(name, source, target, interval) {
    var execSync = require('child_process').execSync;
    var cmd = "convert -delay " + interval + " -loop 0 " + source + " " + target;
    execSync(cmd, { stdio: 'ignore' });
  },

  renderVideo: function(name, source, target, interval) {
    var execSync = require('child_process').execSync;
    var cmd = "ffmpeg -framerate 24 -pattern_type sequence -i 'docode/_temp/sketch%02d.png' -f mp4 -c:v libx264 -pix_fmt yuv420p docode/video/" + target + ".mp4";
    execSync(cmd, { stdio: 'ignore' });
  }
};

exports.docode = docode;
