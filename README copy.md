# Squarespace Cheatsheet Flyby

In this flyby, the first 5 to 10 minutes, we will go through some basic settings for Squarespace, which is alternative way to Wordpress and github static page.

Then, we will learn some quick and dirty ways to set up your portfolio and ITP blog separately, set up analytics, embed creative coding sketches, embed PDF resume and customize your own template.


This Flyby will also cover some tools and resources to make your portfolio. It's time to start your 100 days of internship application.


### Problems to solve
---
1.  How to set up a well-designed personal portfolio website without strong design and programming skills.


2.  How to find out who from where visit my blog or portfolio, track their footprints (and how to not be found out I check someone's website XD).


3.  How to embed full screen creative coding sketches to my page and won't affect the design framework.


4.  How to embed my PDF resume


5.  How to make a grid page and sort your projects by category

6.  How to make a dropdown on your banner


### Testing Material
---
-   Squarespace 14 days free trial account
-   Google analytics account
-   P5 editor sketch: https://alpha.editor.p5js.org/embed/S1VOZL12x
-   github static page:
https://wenqili.github.io/flyby-squarespace/test_sketch/
-   a PDF file

### Why Squarespace, and premade template recommendation
---
-   Why:
    -   Keep portfolio and blog separately on one platform professionally
    -   Less junk information, good user experience, well-designed template, smooth learning curve and saving time
    -   mobile editing, now I do all my blog posts on subway


-   Template:
    -   3 factors to consider: Navi Bar, Index/Project function, Blog
    -   [York](https://www.squarespace.com/templates/york): perfect for grid layout
    -   [Wells](https://www.squarespace.com/templates/wells): perfect side navi bar
    -   [Forte](https://www.squarespace.com/templates/forte): one of the most popular one. Easiest way to make a full screen design
    -   [Alex](https://www.squarespace.com/templates/alex): good full screen stack layout


-   [Student discount](https://www.squarespace.com/students/): after 50% off, it's 72$ per year for personal account, 108$ per year for business account, with a custom domain. Strongly suggest the business account, it has unlimited pages.


### Why Google analytics, and link it to your Squarespace account.
---
-   keep track of your website, and get valued information   
-   [Squarespace Help](https://support.squarespace.com/hc/en-us/articles/205815608-Using-Google-Analytics-with-Squarespace)


### Basic SEO settings
---
in flyby demo


### Customize your template by injecting css/JavaScript code to page header.
---
-   inject to whole website/single page
-   inject css
```html
<style type="text/css">
   body {
     background-color: green;
   }
 </style>
```

-   inject HTML(iframe, most used)
```html
<iframe
  src="https://alpha.editor.p5js.org/embed/S1VOZL12x"
  style="position:fixed;
  display:block;
  top:0px;
  left:0px;
  bottom:0px;
  right:0px;
  width:100vw;
  height:100vh;
  border:none;
  margin:0;
  padding:0;
  overflow:hidden"></iframe>
```


-   inject JavaScript: upload your script first(in flyby demo), the url will start with ```/s/```, then use this code,
```html
<script type="text/javascript" src="/s/myScript.js"></script>
```


### Create a single-page cover page and embed your best project documentation.
---
1.  Go to ```PAGES/"+"/Cover Page```, and choose a layout, here I use ```cover```.


2.  Usually a cover page is the landing page, set it as a home page and add a button link the home page.


3.  To embed a P5 Sketch as the background, remove the background image or video first, then inject the following code to the page header:
```html
<iframe src="Here put your sketch url" style="
position:fixed;
display:block;
top:0px; left:0px; bottom:0px; right:0px;
width:100vw;
height:100vh;
border:none;
margin:0; padding:0;
overflow:hidden"></iframe>

<style type="text/css">
div .sqs-slide {
  position:initial}
  </style>

```

### Embed full screen P5 sketch or sketch blocks under your template by add code block.
---
1.  Have your sketch files in P5 online editor or github. In your css, add following lines to make sure it doesn't have a scroll bar
```css
html, body {
  margin: 0;
  padding: 0;
  overflow:hidden;
}
```


2.  Modify the code to make sure the canvas full screen and responsive, here is how to do it in P5.js

```javascript
//p5
function setup(){
  createCanvas(windowWidth, windowHeight)  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```


3.  Get the embed url in P5 editor, or generate a github static page


4.  In your Squarespace page, add a code block with the following HTML code and do not check "display source"

for full screen embed

```html
<iframe src="your sketch url" style="position:fixed;
top:0px; left:0px; bottom:0px; right:0px;
width:100%; height:100%;
border:none;
margin:0;
padding:0;
overflow:hidden;
z-index:99;"></iframe>

```

for simple block embed
```html
<iframe src="your sketch url" style="display:block;
top:0px; left:0px; bottom:0px; right:0px;
width:100%; height:100vh;
border:none;
margin:0; padding:0;
overflow:hidden"></iframe>
```


### Customize grid showcase page
---
in flyby demo



### Sort your projects by positions/titles
---
-   index or folder
-   archive function
-   summary function



### Embed PDF resume under your template
---
Upload your resume PDF to Squarespace first, it will be stored to the directory ```/s/yourFile```

use following code to embed PDF:
```html
<iframe src="/s/yourPDFURL#zoom=70" style=" display:block;
width:100%; height:100vh;
border:none; margin:0; padding:0; overflow:hidden;"></iframe>
```


### Other Topics
---
-   search engine optimization
-   editing blogs in mobile app
-   mobile ui design
-   navigation styles
-   aesthetics of web design
-   font settings
-   custom interactions through css

### Documentation/case study tools and templates
---
-   Text: [grammerly](https://www.grammarly.com/) /  [1checker](http://www.1checker.com/)
-   Font: [Font Pair](http://fontpair.co/)
-   color: [coolers](https://coolors.co/)
-   CSS: [animista](http://animista.net/)
-   GIF: [GIF brewery 3](http://gifbrewery.com/)
-   Video: iMove or [VUE](https://itunes.apple.com/us/app/vue-video-editor-movie-maker/id1114690993?mt=8)
-   ICON: [noun project](https://thenounproject.com/)
-   Documentation: [casestudy](https://www.casestudy.club/case-studies)

### A portfolio list
---
-   Full Screen: [Claudio Guglieri](http://guglieri.com/bioandwork/)(Designer), [Evan You](http://evanyou.me/)(Front-end Developer)
-   Grid: [Gene Kogan](http://genekogan.com/)(Creative technologist),  [Yotam Mann](https://yotammann.info/)(Musician)
-   Side Bar: [Ben Light](http://blightdesign.com/)(Maker)
-   Side Bar + Grid: [Sarah Rothberg](http://sarahrothberg.com/)(VR Director),
[Gabe BC](http://www.gabebc.com/)(Artist)
-   Side Bar + Full Screen: [Franklin Zhu](http://fengyizhu.com/)(Digital Generalist)
-   Grid + Full Screen: [Edan Kwan](http://edankwan.com/)(Creative technologist)
