// TODO: no longer using point.color. Possibly get rid of?
class ComplexPlanePlot {
  /** 
  minReal, maxReal, minIm, maxIm: the bounds for the real and imaginary axes. Will not display beyond these bounds.
  x, y: the top left corner of the plot on the canvas
  width, height: the width and height of the plot in the canvas
  */
  constructor(minReal, maxReal, minIm, maxIm, x, y, width, height) {
    this.minReal = minReal;
    this.maxReal = maxReal;
    this.minIm = minIm;
    this.maxIm = maxIm;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.points = []
    
    this.colorScheme = 'standard';
    this.axesColor = color(230, 100, 100);
    this.ptColor = color(0,0,0);
  }

  // manages the color scheme.
  colorSchemeManager() {
    if (this.colorScheme == 'standard') {
      this.axesColor = color(230, 100, 100);
      this.ptColor = color(0,0,0);
    }
    else if (this.colorScheme == 'monochrome') {
      this.axesColor = color(100, 100, 100);
      this.ptColor = color(0, 0, 0);
    }
    else {
      //standard for now
      this.axesColor = color(230, 100, 100);
      this.ptColor = color(0,0,0);
    }
  }

  // reset function
  // TODO: make some parameters optional?
  resetPoints(minReal, maxReal, minIm, maxIm, points) {
    this.minReal = minReal;
    this.maxReal = maxReal;
    this.minIm = minIm;
    this.maxIm = maxIm;
    this.points = points;
  }

  draw() {
    fill(255);
    stroke(0);
    strokeWeight(1)
    rect(this.x, this.y, this.width, this.height);

    
    this.drawAxes();
    
    strokeWeight(3);
    this.points.forEach(z => this.plotPoint(z));

    this.labelPlot();
  }

  labelPlot() {
    textSize(windowWidth/50);
    fill(0);
    noStroke();
    textAlign(RIGHT, TOP);
    text(this.maxIm + "i ", this.x, this.y);
    textAlign(RIGHT, BOTTOM);
    text(this.minIm + "i ", this.x, this.y + this.height);
    textAlign(LEFT, TOP);
    text(this.minReal, this.x, this.y + this.height);
    textAlign(RIGHT, TOP);
    text(this.maxReal, this.x + this.width, this.y + this.height);
  }

  drawAxes() {
    stroke(this.axesColor);
    strokeWeight(2);
    // TODO: make this way cleaner (let plotToCanvasCoordinates also accept two numbers instead of complexNumber)
    let origin = this.plotToCanvasCoordinates(new ComplexNumber(0, 0));
    if (this.minIm < 0 && this.maxIm > 0) {
      let leftXAxis = this.plotToCanvasCoordinates(new ComplexNumber(this.minReal, 0));
      let rightXAxis = this.plotToCanvasCoordinates(new ComplexNumber(this.maxReal, 0));
      line(leftXAxis[0], leftXAxis[1], rightXAxis[0], rightXAxis[1]);
    }
    if (this.minReal < 0 && this.maxReal > 0) {
      let topYAxis = this.plotToCanvasCoordinates(new ComplexNumber(0, this.maxIm));
      let bottomYAxis = this.plotToCanvasCoordinates(new ComplexNumber(0, this.minIm));
      line(bottomYAxis[0], bottomYAxis[1], topYAxis[0], topYAxis[1]);
    }
  }


  plotToCanvasCoordinates(z) {
    let ReStep = this.width / (this.maxReal - this.minReal);
    let ImStep = this.height / (this.maxIm - this.minIm);

    let x = this.x + (z.a - this.minReal) * ReStep;
    let y = this.y - (z.b - this.maxIm) * ImStep;

    return [x, y];
  }

  /** Convert canvas coordinates to an imaginary number in the plot */
  canvasToPlotCoordinates(canvasX, canvasY) {
    let ReStep = this.width / (this.maxReal - this.minReal);
    let ImStep = this.height / (this.maxIm - this.minIm);

    let Re = (canvasX - this.x) / ReStep + this.minReal;
    let Im = (canvasY - this.y) / (ImStep) * (-1) + this.maxIm;

    return new ComplexNumber(Re, Im);
  }

  /** Given canvas coordinates, convert the point to an imaginary number that the plot can use, add this to points[], and return the imaginary number */
  addPointInCanvasCoordinates(canvasX, canvasY) {
    z = this.canvasToPlotCoordinates(canvasX, canvasY);
    this.points.append(z);
    return z;
  }

  /** Plot a given complex number (z) on the complex plane, as specified by this class's attributes. */
  plotPoint(z) {
    let canvasCoordinates = this.plotToCanvasCoordinates(z);

    let x = canvasCoordinates[0];
    let y = canvasCoordinates[1];

    if (this.inPlot(x, y)) {
      stroke(this.ptColor);
      point(x, y);
    }
  }

  // returns whether a given point on the canvas is inside this plot
  inPlot(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }
}