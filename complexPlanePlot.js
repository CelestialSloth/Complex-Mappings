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
  }

  draw() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.width, this.height);

    strokeWeight(5);
    this.points.forEach(z => this.plotPoint(z));

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
      stroke(z.color);
      point(x, y);
    }
  }

  // returns whether a given point on the canvas is inside this plot
  inPlot(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }
}