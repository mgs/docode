# DoCode
![IMG](/images/logo.png)

A tool that automatically generates media files, such as videos, GIFs, and screenshots, from your JavaScript sketch file.

The DoCode home page - [https://mgs.github.io/docode/](https://mgs.github.io/docode/)

## Installation

##### Requirements

1. Make sure that Node.js is installed on your machine.   
Open your terminal and type:  
``$ node -v``  
If Node.js is not installed, please go to <a href="https://nodejs.org/">the Node.js official site</a> and install it.</li>

1. Make sure that ImageMagick is installed on your machine.  
Open your terminal and type:  
``$ convert``  
If ImageMagick is not installed, please go to the [ImageMagick download page](https://www.imagemagick.org/script/download.php) and install it, or type the following command on the terminal:  
``$ brew install imagemagick``


##### DoCode Installation (on a Mac)
1. Install the doCode NPM package globally:  
``$ sudo npm install docode -g``  
You might be asked to enter you Mac user password.

1. Check that doCode was installed correctly:  
``$ docode``  
Should not return anything ✊.

## How to use
#### Generate screenshots from a [p5.js](https://p5js.org/) sketch

While in the project (sketch) main folder, run the following command:  
``$ docode --screenshots`` or ``$ docode -s``  
*(mind the single dash on the latter)*

When not on the project main folder, you can specify the project folder like this:  
``$ docode --screenshots=<path_to_sketch_folder>`` or  
``$ docode -s=<path_to_sketch_folder>``  

#### Generate a GIF from a [p5.js](https://p5js.org/) sketch
While in the project (sketch) main folder:  
``$ docode --gif`` or ``$ docode -g``

When not on the project main folder:  
``$ docode --gif=<path_to_sketch_folder>`` or  
``$ docode -g=<path_to_sketch_folder>``  

#### Generate a video from a [p5.js](https://p5js.org/) sketch
While in the project (sketch) main folder:  
``$ docode --video`` or ``$ docode -v``

When not on the project main folder:  
``$ docode --video=<path_to_sketch_folder>`` or  
``$ docode -v=<path_to_sketch_folder>``  

## Uninstall (on a Mac)
Use the following command:  
``$ sudo npm uninstall -g docode``  
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
