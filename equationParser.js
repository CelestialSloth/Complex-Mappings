class EquationParser {

  static digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  static chars = ['z', 'e', 'i'];
  static operators = ['+', '-', '*', '/', '^'];
  static paren = ['(', ')'];
  
  // conj - complex conjugate, arg - angle, mod - |z|, log - ln(z)
  static functions = ['sqrt', 'conj', 'log', 'arg', 'mod'];
  
  static parseEquation(equation) {
    print("Equation: " + equation);
    //break equation into array of parts
    let tokenArray = EquationParser.tokenArray(equation);
    print("Tokens: " + EquationParser.printArr(tokenArray));
    
    // execute shuntingyard
    let postfix = EquationParser.infixToPostfix(tokenArray)
    print("Postfix: " + EquationParser.printArr(postfix))
    
    // compute in postfix
    let computed = EquationParser.computePostfix(postfix, new ComplexNumber(1, 0));
    print("Computed: " + computed.toString());
    
  }

  // Input: string representing equation. Output: array with each token
  static tokenArray(equation) {
    let digits = EquationParser.digits;
    let chars = EquationParser.chars;
    let operators = EquationParser.operators;
    let functions = EquationParser.functions;
    let paren = EquationParser.paren;
    
    let equationArray = [];
    let equationIndex = 0;
    
    while(equationIndex < equation.length) {
      
      let currentChar = equation.charAt(equationIndex);
      
      // determine if this is a unary minus
      if(currentChar === '-') {
        let unaryMinus = false;
        
        // determine if it's a unary minus or an operator
        // if it's at the very beginning of the equation
        if (equationArray.length == 0) {
          unaryMinus = true;
        }
        // if it's right after (
        else if(equationArray.slice(-1)[0] === '('){
          unaryMinus = true;
        }

        // if it is a unary minus, mult by -1. If not, it's a regular operator
        if(unaryMinus) {
          equationArray.push(new ComplexNumber(-1, 0));
          equationArray.push('*');
        }
        else {
          equationArray.push(currentChar);
        }
        equationIndex ++;
      }
      // if a number, find end of number
      else if(digits.includes(currentChar)) {
        let number = ''        
        while(equationIndex < equation.length && digits.includes(currentChar)) {
          number += currentChar;
          equationIndex ++;
          currentChar = equation.charAt(equationIndex);
        }
        equationArray.push(new ComplexNumber(Number(number), 0));
      }
      // z, i, e, ...
      else if (chars.includes(currentChar)) {
        // check what's before it and if there should be multiplication (eg, if you have 2z (1-z)i)
        let previousEntry = null;
        if(equationArray.length > 0) { previousEntry = equationArray.slice(-1)[0]; }
        if(previousEntry instanceof ComplexNumber || previousEntry == ')' || chars.includes(previousEntry)){
          equationArray.push('*');
        }

        // now actually input the char into the array
        let val;
        switch(currentChar){
          case 'z':
            val = currentChar;
            break;
          case 'e':
            val = new ComplexNumber(2.71828182845904523536, 0);
            break;
          case 'i':
            val = new ComplexNumber(0, 1);
            break;
          default:
            throw new Error('This is not a valid equation character: ' + currentChar);
        }
        equationArray.push(val);
        equationIndex ++;
      }
      // open paren
      else if (currentChar == '('){
        // check what's before it and if there should be multiplication (eg, if you have 2z(i+3) )
        let previousEntry = null;
        if(equationArray.length > 0) { previousEntry = equationArray.slice(-1)[0]; }
        if(previousEntry instanceof ComplexNumber || previousEntry == ')' || chars.includes(previousEntry)){
          equationArray.push('*');
        }
        equationArray.push(currentChar);
        equationIndex ++;
      }
      //other operators and parentheses
      else if (operators.includes(currentChar) || paren.includes(currentChar)) {
        equationArray.push(currentChar);
        equationIndex ++;
      }
      // it's a string of letters. Find the end of the string
      else {
        let word = '';
        while(equationIndex < equation.length && /^[a-z]/i.test(currentChar)) {
          word += currentChar;
          equationIndex ++;
          currentChar = equation.charAt(equationIndex);
        }
        //if the word is indeed a function, add it to array
        if(functions.includes(word)) {
          equationArray.push(word);
          //equationIndex ++;
        }
        else {
          throw (word + " is not a function!");
        }
      }
      
    }
    return equationArray;
  }

  // execute shuntingyard algorithm
  // source: https://en.wikipedia.org/wiki/Shunting_yard_algorithm
  // yes, I'm aware this is bad code
  static infixToPostfix(tokenArray) {
    let outputQueue = [];
    let operatorStack = [];

    let functions = EquationParser.functions;
    let operators = EquationParser.operators;
    
    // while there are tokens to be read:
    for (let token of tokenArray) {
      // token is a number
      if(token instanceof ComplexNumber || token == 'z') {
        // put it into the output queue
        outputQueue.push(token);
      }
      // token is a function
      else if(functions.includes(token)) {
        // push it onto the operator stack
        operatorStack.push(token);
      }
      // token is an operator o1
      else if(operators.includes(token)) {
        while(EquationParser.opWhileCondition(operatorStack, token)) {
          // pop o2 from the operator stack into the output queue
          outputQueue.push(operatorStack.pop());
        }
        // push o1 (token) onto the operator stack
        operatorStack.push(token);
      }
      // token is a left parenthesis '('
      else if(token === '(') {
        //push it onto the operator stack
        operatorStack.push(token);
      }
      // token is a right parenthesis ')'
      else if(token === ')') {
        // while the operator at top of op stack is not '('
        while(operatorStack.length == 0 || operatorStack.slice(-1)[0] !== '(') {
          // assert the operator stack is not empty
          if(operatorStack.length == 0) {
            throw new Error("Mismatched parentheses!");
          }

          // pop the operator from the operator stack into the output queue
          outputQueue.push(operatorStack.pop());
        }

        //assert there is a left parenthesis at the top of the operator stack (already done...?)
        //pop the left parenthesis from op stack, discard
        operatorStack.pop();

        //if there is a function token at the top of the operator stack
        if(operatorStack.length > 0 && functions.includes(operatorStack.slice(-1)[0])) {
          //pop the function from the op stack --> output queue
          outputQueue.push(operatorStack.pop());
        }
        
      }
    }
  
    // pop the remaining items from the operator stack into the output queue
    // while there are tokens on the operator stack
    while(operatorStack.length > 0) {
      let topOfOpStack = operatorStack.pop();
      
      // assert operator at top of stack is not a left parenthesis
      if(topOfOpStack === '(') {
        throw new Error("Extra left parenthesis!");
      }
      
      //pop from opStack --> outputQueue
      outputQueue.push(topOfOpStack);
    }

    return outputQueue;
  
  }

  // compute a complex postfix equation, inputting some complex number for z
  // https://www.geeksforgeeks.org/evaluation-of-postfix-expression/
  static computePostfix(postfix, z) {
    let chars = EquationParser.chars;
    let operators = EquationParser.operators;
    let functions = EquationParser.functions;
    
    let stack = [];
    
    for (let token of postfix) {
      // if it's a number, push it into the stack
      if (token instanceof ComplexNumber) {
        stack.push(token);
      }
      else if (token == 'z') {
        stack.push(z);
      }
      // if it's an operator, pop operands for the operator from the stack. Evaluate, and push the result to the stack
      else if(operators.includes(token)) {
        let n2 = stack.pop();
        let n1 = stack.pop();
        stack.push(EquationParser.evalOp(n1, n2, token));
      }
      else if(functions.includes(token)) {
        let n = stack.pop();
        stack.push(EquationParser.evalFunc(n, token));
      }
    }
    if (stack.length != 1) {
      throw new Error("The stack should only have one object in it, but instead it's this: " + EquationParser.printArr(stack));
    }
    return stack[0];
  }
  
  // return an integer precedence level
  static precedence(operator) {
    switch(operator) {
      case '^':
        return 4;
      case '*':
        return 3;
      case '/':
        return 3;
      case '+':
        return 2;
      case '-':
        return 2;
      default:
        throw new Error("Not a valid operator: " + operator);
    }
  }

  // return true if the operator is left associative
  static assocLeft(operator) {
    switch(operator) {
      case '^':
        return false;
      case '*':
        return true;
      case '/':
        return true;
      case '+':
        return true;
      case '-':
        return true;
      default:
        throw new Error("Not a valid operator: " + operator);
    }
  }

  // performs complex operation on complex numbers n1 and n2
  static evalOp(n1, n2, operator) {
    switch(operator) {
      case '^':
        return n1.pow(n2);
      case '*':
        return n1.times(n2);
      case '/':
        return n1.over(n2);
      case '+':
        return n1.plus(n2);
      case '-':
        return n1.minus(n2);
      default:
        throw new Error("Not a valid operator: " + operator);
    }
  }

  static evalFunc(n, f) {
    //'sqrt', 'conj', 'log', 'arg', 'mod'
    switch(f) {
      case 'sqrt':
        return n.sqrt();
      case 'conj':
        return n.conjugate();
      case 'log':
        return n.log();
      case 'arg':
        return new ComplexNumber(n.arg(), 0);
      case 'mod':
        return new ComplexNumber(n.modulus(), 0);
      default:
        throw new Error("invalid function " + f);
    }
  }

  static printArr(arr) {
    let str = '';
    for (let obj of arr) {
      if (obj instanceof ComplexNumber) {
        str = str.concat(obj.toString());
      }
      else {
        str = str.concat(obj);
      }
      str = str.concat(', ');
    }
    return str;
  }


  // Deals with the long while condition in the shuntingyard algorithm. returns T/F.
  static opWhileCondition(opStack, o1) {
    let operators = EquationParser.operators;
    // return true if all of the following are met

    // a) there is an operator o2 at top of operator stack
    if(opStack.length === 0) { return false; }
    let o2 = opStack.slice(-1)[0];
    if(!operators.includes(o2)) { return false; }
    
    // b) o2 != '('
    if (o2 === '(') { return false; }

    // c) AND one of the following
    // c1) o2 precedence > o1 precedence
    let condition1 = EquationParser.precedence(o2) > EquationParser.precedence(o1);
    // c2) o1 precedence == o2 precedence AND o1 is left-assoc
    let condition2 = EquationParser.precedence(o1) === EquationParser.precedence(o2) && EquationParser.assocLeft(o1)

    if (condition1 || condition2) { return true; }

    return false;
  }
  
}
  
  