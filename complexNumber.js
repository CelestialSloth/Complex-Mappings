class ComplexNumber {
  /** Constructor for a ComplexNumber of the form a+bi
  @param a: real part
  @param b: imaginary part
  */
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.color = color(0, 0, 0);
  }

  /** Add a complex number to this instance of a complex number. 
  Return a new instance of a complex number with that value*/
  plus(complexNumber) {
    let a = this.a + complexNumber.a;
    let b = this.b + complexNumber.b;
    return new ComplexNumber(a, b);
  }
  /** Subtract a complex number from this instance of a complex number. 
  Return a new instance of a complex number with that value*/
  minus(complexNumber) {
    let a = this.a - complexNumber.a;
    let b = this.a - complexNumber.b;
    return new ComplexNumber(a, b);
  }

  /** Multiple this instance by another complex number.
  Return a new instance of a complex number with that value*/
  times(complexNumber) {
    let a1 = this.a * complexNumber.a;
    let a2 = -1 * this.b * complexNumber.b;
    let b1 = this.b * complexNumber.a;
    let b2 = this.a * complexNumber.b;

    return new ComplexNumber(a1 + a2, b1 + b2);
  }

  /** Return the complex conjugate as a new instance*/
  conjugate() {
    return new ComplexNumber(this.a, -this.b);
  }

  /** Return T/F: whether this complex number is equal to 0 */
  isZero() {
    return this.a == 0 && this.b == 0;
  }

  /** Returns this / complexNumber as a new instance (division) */
  over(complexNumber) {
    if (complexNumber.isZero()) {
      return null;
    }
    
    let a = this.a;
    let b = this.b;
    let c = complexNumber.a;
    let d = complexNumber.b;

    let denominator = c*c + d*d;
    let realNumerator = a*c + b*d;
    let imaginaryNumerator = b*c - a*d;

    return new ComplexNumber(realNumerator/denominator, imaginaryNumerator/denominator);
  }
}