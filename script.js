//TODO: figure out square root weirdness (static seems diff from nonstatic)
//TODO: test more thoroughly
let pts = [];
let mappedPts = [];
let ptsPlot;

function f(z) {
  let w = new ComplexNumber(0, 1);
  //mappedZ = z.times(z);
  mappedZ = ComplexNumber.sqrt(z);
  mappedZ.color = z.color;
  return mappedZ;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);

  //make a circle
  // for (var theta = 0; theta < 2*3.1415; theta += 0.2) {
  //   var z = new ComplexNumber(cos(theta), sin(theta));
  //   pts.push(z);
  //   mappedPts.push(f(z));
  // }

  ptsPlot = new ComplexPlanePlot(-2, 2, -2, 2, 50, 50, 200, 200);

  mappedPtsPlot = new ComplexPlanePlot(-2, 2, -2, 2, 300, 50, 200, 200);
  
  //make a line
  // for (var y = -1.5; y < 1.5; y += 0.05) {
  //   var z = new ComplexNumber(1, y);
  //   z.color = color(0, 125 + y*90, 255);
  //   ptsPlot.points.push(z);
  //   mappedPtsPlot.points.push(f(z));
  // }

  
}



function draw() {
  if(mouseIsPressed) {
    x = mouseX;
    y = mouseY;
    
    if(ptsPlot.inPlot(x, y)) {
      let z = ptsPlot.canvasToPlotCoordinates(x, y);
      z.color = color(0, 0, 0);
      ptsPlot.points.push(z);
      mappedPtsPlot.points.push(f(z));
    }
      
  }
  
  ptsPlot.draw();
  mappedPtsPlot.draw();
}

