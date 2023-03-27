
var pts = [];
var mappedPts = [];
var ptsPlot;

function f(z) {
  w = new ComplexNumber(0.5, -0.5);
  mappedZ = z.times(z).times(w);
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

  //make a line
  for (var y = -1.5; y < 1.5; y += 0.05) {
    var z = new ComplexNumber(1, y);
    z.color = color(0, 125 + y*90, 255);
    pts.push(z);
    mappedPts.push(f(z));
  }

  ptsPlot = new ComplexPlanePlot(-2, 2, -2, 2, 50, 50, 200, 200);
  ptsPlot.points = pts;

  mappedPtsPlot = new ComplexPlanePlot(-2, 2, -2, 2, 300, 50, 200, 200);
  mappedPtsPlot.points = mappedPts;
}

function draw() {
  ptsPlot.draw();
  mappedPtsPlot.draw();
}

