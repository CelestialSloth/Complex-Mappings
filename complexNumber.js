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
  plus() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);

    let a = this.a + complexNumber.a;
    let b = this.b + complexNumber.b;
    return new ComplexNumber(a, b);
  }

  /** add z and w (both are complex numbers) */
  static add() {
    let numArray = ComplexNumber.twoComplexNumbersFromArgs(arguments);
    let z = numArray[0];
    let w = numArray[1];
    return z.plus(w);
  }

  /** Subtract a complex number from this instance of a complex number. 
  Return a new instance of a complex number with that value*/
  minus() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);

    let a = this.a - complexNumber.a;
    let b = this.b - complexNumber.b;
    return new ComplexNumber(a, b);
  }

  /** return z - w as a new ComplexNumber */
  static subtract() {
    let numArray = ComplexNumber.twoComplexNumbersFromArgs(arguments);
    let z = numArray[0];
    let w = numArray[1];
    return new ComplexNumber(z.a - w.a, z.b - w.b);
  }

  /** Multiple this instance by another complex number.
  Return a new instance of a complex number with that value*/
  times() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);

    let a1 = this.a * complexNumber.a;
    let a2 = -1 * this.b * complexNumber.b;
    let b1 = this.b * complexNumber.a;
    let b2 = this.a * complexNumber.b;

    return new ComplexNumber(a1 + a2, b1 + b2);
  }

  static multiply() {
    let numArray = ComplexNumber.twoComplexNumbersFromArgs(arguments);
    let z = numArray[0];
    let w = numArray[1];
    return z.times(w);
  }

  /** Return the complex conjugate as a new instance*/
  conjugate() {
    return new ComplexNumber(this.a, -this.b);
  }

  static conjugate() {
    let z = ComplexNumber.complexNumberFromArgs(arguments);
    return z.conjugate();
  }

  /** Return T/F: whether this complex number is equal to 0 */
  isZero() {
    return this.a == 0 && this.b == 0;
  }
  static isZero() {
    let z = ComplexNumber.complexNumberFromArgs(arguments);
    return z.isZero();
  }

  /** Returns this / complexNumber as a new instance (division) */
  over() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);

    let a = this.a;
    let b = this.b;
    let c = complexNumber.a;
    let d = complexNumber.b;

    let denominator = c * c + d * d;
    let realNumerator = a * c + b * d;
    let imaginaryNumerator = b * c - a * d;

    return new ComplexNumber(realNumerator / denominator, imaginaryNumerator / denominator);
  }
  /** returns z/w */
  static divide() {
    let numArray = ComplexNumber.twoComplexNumbersFromArgs(arguments);
    let z = numArray[0];
    let w = numArray[1];
    return z.over(w);
  }

  /** Returns -(this) as a new instance */
  negative() {
    return new ComplexNumber(-this.a, -this.b);
  }
  static negative() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.negative();
  }

  /** Return the modulus |this| */
  modulus() {
    let a = this.a;
    let b = this.b;
    return Math.sqrt(a * a + b * b);
  }
  static modulus() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.modulus();
  }

  /** Returns arg(this). Note that arg(z) falls in (-pi, pi]. Algorithm from wikipedia: https://en.wikipedia.org/wiki/Argument_(complex_analysis)*/
  arg() {
    let a = this.a;
    let b = this.b;

    if (b !== 0) {
      return 2 * Math.atan((this.modulus() - a) / b);
    }
    else if (a > 0 && b == 0) {
      return 0;
    }
    else if (a < 0 && b == 0) {
      return Math.PI;
    }
    else if (a == 0 && b == 0) {
      throw new Error('Error: Taking arg of 0');
    }
    return;

  }
  static arg() {
    let complexNumber = this.complexNumberFromArgs(arguments);
    return complexNumber.arg();
  }

  /** Returns the principal branch of the natural log of this */
  log() {
    let ln_mod = Math.log(this.modulus());
    let arg = this.arg();
    return new ComplexNumber(ln_mod, arg);
  }
  static log() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.log();
  }

  /** Raises e to the power of this and returns the answer as a new ComplexNumber.*/
  exp() {
    let a = this.a;
    let b = this.b;
    let e_a = Math.exp(a);
    return new ComplexNumber(e_a * Math.cos(b), e_a * Math.sin(b));
  }
  static exp() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.exp();
  }

  /** Raises this to the power of complexNumber. */
  pow() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);

    return (complexNumber.times(this.log())).exp();
  }
  static pow() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.pow();
  }

  /** Returns the square root of this as a new ComplexNumber */
  sqrt() {
    let root_r = Math.sqrt(this.modulus());
    let half_theta = 0.5 * this.arg();
    let exp_i_half_theta = (new ComplexNumber(0, half_theta)).exp();
    return exp_i_half_theta.times(new ComplexNumber(root_r, 0));
  }
  static sqrt() {
    let complexNumber = ComplexNumber.complexNumberFromArgs(arguments);
    return complexNumber.sqrt();
  }

  /** Takes in a list of arguments and returns the complex number */
  static complexNumberFromArgs(args) {
    let complexNumber;
    if (args.length == 1) {
      complexNumber = args[0];
    }
    else if (args.length == 2) {
      complexNumber = new ComplexNumber(args[0], args[1]);
    }
    else {
      throw new Error("Invalid number of arguments: " + args);
    }
    return complexNumber;
  }

  /** Takes in a list of arguments and returns two complex numbers */
  static twoComplexNumbersFromArgs(args) {
    let z, w;
    if (args.length == 2) {
      z = args[0];
      w = args[1];
    }
    else if (args.length == 4) {
      z = new ComplexNumber(args[0], args[1]);
      w = new ComplexNumber(args[2], args[3]);
    }
    else {
      throw new Error("Invalid number of arguments: " + args);
    }
    return [z, w];
  }

  /** Takes in four numbers and performs the corresponding mobius transformation */
  mobius(a, b, c, d) {
    return (this.times(a).plus(b)).over(this.times(c).plus(d));
  }

  toString() {
    return str(this.a) + " + " + str(this.b) + "i";
  }
}