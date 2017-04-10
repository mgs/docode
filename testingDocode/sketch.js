function setup() {
  createCanvas(800,600);
  //®frameRate(10);
  textSize(18);
}

function draw() {
  background(255);
  text(frameCount, width/2, height/2);
}