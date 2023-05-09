let canvasDiv = document.getElementById('canvas');
let canvasWidth = canvasDiv.offsetWidth;
let canvasHeight = canvasWidth * 0.425;

let maxRe = 4;
let maxIm = 4;
let minRe = -4;
let minIm = -4;

let ptsPlot;
let mappedPtsPlot;

let fPostfix = ['z'];

/** TODO: 
* Dividing by zero errors in both over and when rescaling the graphs 
* Add Re(z) and Im(z) to functionality
* can it interpret log vs Log (capitals)? log yes, Log no -- good :)
* Scaling
*/

function setFPostfix(fInfixStr) {
  let oldPostfix = fPostfix;
  
  try {
    let fTokenArray = EquationParser.tokenArray(fInfixStr);
    fPostfix = EquationParser.infixToPostfix(fTokenArray);
    // test a value
    // EquationParser.computePostfix(fPostfix, new ComplexNumber(1, 1));
    // console.log("Tested a value");
    
    recalculatePlot();
  }
  catch (error) {
    fPostfix = oldPostfix;
    return error;
  }
  
}

function f(z) {
  return EquationParser.computePostfix(fPostfix, z);
}

//change the color scheme
function setColorScheme(newScheme) {
  ptsPlot.colorScheme = newScheme;
  mappedPtsPlot.colorScheme = newScheme;
  ptsPlot.colorSchemeManager();
  mappedPtsPlot.colorSchemeManager();
}

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
  canvasHeight = canvasWidth * 0.425;
  ptsPlot.width = canvasWidth / 3;
  ptsPlot.height = ptsPlot.width;
  ptsPlot.x = canvasWidth / 12;
  ptsPlot.y = canvasHeight / 10;
  ptsPlot.height = canvasWidth / 3;
  mappedPtsPlot.width = canvasWidth / 3;
  mappedPtsPlot.height = mappedPtsPlot.width;
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

function rescaleInputPlot(inputRealMin, inputRealMax, inputImMin, inputImMax) {
  try{
    ptsPlot.resetPlot(inputRealMin, inputRealMax, inputImMin, inputImMax, ptsPlot.points);
  }
  catch (error) {
    console.log(error);
    return error;
  }
  
}
function rescaleOutputPlot(outputRealMin, outputRealMax, outputImMin, outputImMax) {
  try {
    mappedPtsPlot.resetPlot(outputRealMin, outputRealMax, outputImMin, outputImMax, mappedPtsPlot.points);
  }
  catch (error) {
    console.log(error);
    return error;
  }
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
  canvas.parent('canvas');

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
      ptsPlot.points.push(z);
      mappedPtsPlot.points.push(f(z));
    }

  }

  ptsPlot.draw();
  mappedPtsPlot.draw();
  drawArrow();
  drawfOfz();
}

