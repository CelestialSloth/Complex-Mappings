let canvasDiv = document.getElementById('canvas');
let canvasWidth = canvasDiv.offsetWidth;
let canvasHeight = canvasWidth * 0.5;

let maxRe = 4;
let maxIm = 4;
let minRe = -4;
let minIm = -4;

let ptsPlot;
let mappedPtsPlot;

let fPostfix = ['z'];

/** TODO
* give user error if they entered a weird equation, and don't shut down
* make it so "2i" actually works (shouldn't be too hard)
* make it so "2z" actually works (also shouldn't be too hard)
* allow user to manually set min/max for plots
*/

function setFPostfix(fInfixStr) {
  fTokenArray = EquationParser.tokenArray(fInfixStr);
  fPostfix = EquationParser.infixToPostfix(fTokenArray);
  recalculatePlot();
}

function f(z) {
  return EquationParser.computePostfix(fPostfix, z);
}

// let fString = '2z';
// function setFString(fStr) {
//   fString = fStr;
// }

//change the color scheme
function setColorScheme(newScheme) {
  ptsPlot.colorScheme = newScheme;
  mappedPtsPlot.colorScheme = newScheme;
  ptsPlot.colorSchemeManager();
  mappedPtsPlot.colorSchemeManager();
}

/*function f(z) {
  let mappedZ = z;
  if (fString == 'iz') {
    mappedZ = z.times(0, 1);
  }
  else if (fString == '1/z') {
    mappedZ = (new ComplexNumber(1, 0)).over(z);
  }
  else if (fString == '2z') {
    mappedZ = z.times(2, 0);
  }
  else if (fString == 'log(z)') {
    mappedZ = z.log();
  }
  else if (fString == 'e^z') {
    mappedZ = z.exp();
  }
  else if (fString == 'conj(z)') {
    mappedZ = z.conjugate();
  }
  else if (fString == 'z^2') {
    mappedZ = z.times(z);
  }
  else if (fString == 'sqrt(z)') {
    mappedZ = z.sqrt();
  }

  mappedZ.color = z.color;
  return mappedZ;
}*/

function drawArrow() {
  stroke(0);
  strokeWeight(3);
  line(canvasWidth / 24 * 11, canvasHeight / 10 + canvasWidth / 6, canvasWidth / 24 * 13, canvasHeight / 10 + canvasWidth / 6);
  line(canvasWidth / 24 * 13, canvasHeight / 10 + canvasWidth / 6, canvasWidth / 24 * 13 * 0.97, canvasHeight / 10 + canvasWidth / 6 * 0.93)
  line(canvasWidth / 24 * 13, canvasHeight / 10 + canvasWidth / 6, canvasWidth / 24 * 13 * 0.97, canvasHeight / 10 + canvasWidth / 6 * 1.07)
}

function drawfOfz() {
  textAlign(CENTER, BOTTOM);
  textSize(canvasWidth / 40);
  noStroke();
  fill(0);
  text("f(z)", canvasWidth / 24 * 12, canvasHeight / 10 + canvasWidth / 6 * 0.9)
}

function windowResized() {
  canvasWidth = canvasDiv.offsetWidth;
  canvasHeight = canvasWidth * 0.5;
  ptsPlot.width = canvasWidth / 3;
  ptsPlot.x = canvasWidth / 12;
  ptsPlot.y = canvasHeight / 10;
  ptsPlot.height = canvasWidth / 3;
  mappedPtsPlot.width = canvasWidth / 3;
  mappedPtsPlot.height = canvasWidth / 3;
  mappedPtsPlot.x = canvasWidth / 12 * 7;
  mappedPtsPlot.y = canvasHeight / 10;
  resizeCanvas(canvasWidth, canvasHeight);
}

// recalculate the point positions after the plot has been altered
// weird at start
function recalculatePlot() {
  let mappedPts = [];
  for (pt of ptsPlot.points) {
    mappedPts.push(f(pt));
  }

  mappedPtsPlot.points = mappedPts;
}

// delete all the points
function clearPts() {
  ptsPlot.points = [];
  mappedPtsPlot.points = [];
}

function fitToPts() {
  mappedPtsPlot.fitToPoints();
}

function setup() {  
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('program');

  ptsPlot = new ComplexPlanePlot(minRe, maxRe, minIm, maxIm, canvasWidth / 12, canvasHeight / 10, canvasWidth / 3, canvasWidth / 3);

  mappedPtsPlot = new ComplexPlanePlot(minRe, maxRe, minIm, maxIm, 7 * canvasWidth / 12, canvasHeight / 10, canvasWidth / 3, canvasWidth / 3);

  //make a circle
  // for (let r = 0; r < 1; r += 0.05) {
  //   for (var theta = 0; theta < 2*3.1415; theta += 0.05) {
  //     var z = new ComplexNumber(r*cos(theta), r*sin(theta));
  //     ptsPlot.points.push(z);
  //     mappedPtsPlot.points.push(f(z));
  //   }
  // }

  //make a line
  // for (var y = -7; y < 7; y += 0.01) {
  //   var z = new ComplexNumber(0, y);
  //   z.color = color(0, 200 + y * 50, 255);
  //   ptsPlot.points.push(z);
  //   mappedPtsPlot.points.push(f(z));
  // }

  //make a grid
  // for (var y = -2; y < 2; y += 0.05) {
  //   for (var x = -2; x < 2; x += 0.05) {
  //     var z = new ComplexNumber(x, y);
  //     z.color = color(125 - y * 70 + 10, 125 + x * 70, 125 - x * y * 25);
  //     ptsPlot.points.push(z);
  //     mappedPtsPlot.points.push(f(z));

  //   }
  // }


}



function draw() {
  background(200);

  if (mouseIsPressed) {
    x = mouseX;
    y = mouseY;

    if (ptsPlot.inPlot(x, y)) {
      let z = ptsPlot.canvasToPlotCoordinates(x, y);
      z.color = color(0, 0, 0);
      ptsPlot.points.push(z);
      mappedPtsPlot.points.push(f(z));
    }

  }

  ptsPlot.draw();
  mappedPtsPlot.draw();
  drawArrow();
  drawfOfz();
}

