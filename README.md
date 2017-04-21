# DoCode
![IMG](/images/logo.png)

A tool that automatically generates media files, such as videos, GIFs, and screenshots, from your JavaScript sketch file.

The DoCode home page - [https://mgs.github.io/docode/](https://mgs.github.io/docode/)

## Installation

##### Requirements

1. Make sure that Node.js is installed on your machine.   
Open your terminal and type:  
```
$ node -v
```
If Node.js is not installed, please go to <a href="https://nodejs.org/">the Node.js official site</a> and install it.</li>

1. Make sure that ImageMagick is installed on your machine.  
Open your terminal and type:  
```
$ convert
```
If ImageMagick is not installed, please go to the [ImageMagick download page](https://www.imagemagick.org/script/download.php) and install it, or type the following command on the terminal:  
```
$ brew install imagemagick
```

1. Make sure that ffmpeg is installed on your machine.  
Open your terminal and type:  
```
$ ffmpeg
```
If ffmpeg is not installed, please go to the [ffmpeg Mac OS X download page](https://trac.ffmpeg.org/wiki/CompilationGuide/MacOSX) and install it, or type the following command on the terminal:  
```
$ brew install ffmpeg
```


##### DoCode Installation (on a Mac)
1. Install the doCode NPM package globally:  
```
$ sudo npm install docode -g
```
You might be asked to enter you Mac user password.

1. Check that doCode was installed correctly:  
```
$ docode
```  
Should return the docode help ✊.

## How to use
#### Generate screenshots from a [p5.js](https://p5js.org/) sketch

While in the project (sketch) main folder, run the following command:  
```
$ docode screenshots
```
You can also specify the number of screenshots and the interval between the screenshots in seconds, like this:  
```
$ docode screenshots [number_of_images] [interval]
```
For example, to receive 30 screenshots with 2 seconds between them, use:  
```
$ docode screenshots 30 2
```

#### Generate a GIF from a [p5.js](https://p5js.org/) sketch
While in the project main folder, run the following command:
```
$ docode gif
```
Specify the number of images in the GIF and the interval between them in seconds, like this:
```
$ docode gif [number_of_images] [interval]
```
For example, to receive a GIF from 120 images with 0.5 seconds between them, use:
```
$ docode gif 120 0.5
```

#### Generate a video from a [p5.js](https://p5js.org/) sketch
While in the project main folder, run the following command:
```
$ docode video
```
Specify the length of the video in seconds and the interval between images, that will be used to create the video, like this:
```
$ docode video [length] [interval]
```
For example, to receive a 24 seconds video that was created from images that were taken in intervals of 1.4 seconds between them, use:
```
$ docode video 24 1.4
```

## Uninstall (on a Mac)
Use the following command:  
```
$ sudo npm uninstall -g docode
```  
You might be asked to enter you Mac user password.


## Contributors
DoCode was built with ❤️ by:  
😎 [Michael Simpson](http://mgs.nyc/)  
🤗 [Eric Li](https://www.wenqili.com/)  
🤠 [Alejandro Matamala](http://www.matamala.info/)  
😝 [Dror Ayalon](http://www.drorayalon.com)

With the support of:  
[Patrick Hebron](http://www.patrickhebron.com/)  
[Rune Madsen](https://runemadsen.com/)  
at [NYU ITP](http://tisch.nyu.edu/itp)  



## License
>You can check out the full license [here](https://github.com/IgorAntun/node-chat/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
