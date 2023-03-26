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

    stroke(0);
    strokeWeight(10);
    this.points.forEach(z => this.plotPoint(z));
    
  }

  /** Plot a given complex number (z) on the complex plane, as specified by this class's attributes. */
  plotPoint(z){
    var ReStep = this.width / (this.maxReal - this.minReal);
    var ImStep = this.height / (this.maxIm - this.minIm);

    var a = this.x + (z.a - this.minReal) * ReStep;
    var b = this.y - (z.b - this.maxIm) * ImStep;

    point(a, b);
  }
}