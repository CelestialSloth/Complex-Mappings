class EquationParser {

  static digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  static chars = ['z', 'e', 'i'];
  static operators = ['+', '-', '*', '/', '^'];
  static paren = ['(', ')'];
  
  // conj - complex conjugate, arg - angle, mod - |z|, log - ln(z)
  static functions = ['sqrt', 'conj', 'log', 'arg', 'mod'];
  
  static parseEquation(equation) {
    //break equation into array of parts
    let tokenArray = EquationParser.tokenArray(equation);
  
    // execute shuntingyard
    let infix = EquationParser.infixToPostfix(tokenArray)
    print(infix);
    
    // compute in postfix
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
      
      // if a number, find end of number
      if(digits.includes(currentChar)) {
        let number = ''
        while(equationIndex < equation.length && digits.includes(currentChar)) {
          number += currentChar;
          equationIndex ++;
          currentChar = equation.charAt(equationIndex);
        }
        equationArray.push(number);
      }
      else if (chars.includes(currentChar) || operators.includes(currentChar) || paren.includes(currentChar)) {
        equationArray.push(currentChar);
        equationIndex ++;
      }
      // it's a string of letters. Find the end of the string
      else {
        let word = '';
        while(equationIndex < equation.length && /^[a-z]/i.test(currentChar)) {
          print(currentChar + ' is a letter');
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
    print(equationArray);
    return equationArray;
  }

  // execute shuntingyard algorithm
  // source: https://en.wikipedia.org/wiki/Shunting_yard_algorithm
  // yes, I'm aware this is bad code
  static infixToPostfix(tokenArray) {
    let outputQueue = [];
    let operatorStack = [];
    
    let digits = EquationParser.digits;
    let chars = EquationParser.chars;
    let operators = EquationParser.operators;
    let functions = EquationParser.functions;

    // while there are tokens to be read
    for(let token of tokenArray) {

      // if the token is a number, put it in the output queue
      if (isFinite(token) || chars.includes(token)) {
        outputQueue.push(token);
      }
      // if it's a function, push onto operator stack
      else if (functions.includes(token)) {
        operatorStack.push(token);
      }
      //if it's an operator
      else if (operators.includes(token)) {
        // while (there is an operator o2 at top of opStack which is not a left parenthesis), and (o2 prec > token or (o1 prec == o2 prec and o1 is left-assoc))
        let o2;
        if (operatorStack.length > 0) {o2 = operatorStack.slice(-1)[0];}
        while (operatorStack.length > 0 && operators.includes(o2) && o2 != '(' && (EquationParser.precedence(o2) > EquationParser.precedence(token) || (EquationParser.precedence(o2) == EquationParser.precedence(token) && EquationParser.assocLeft(token)))) {
          outputQueue.push(operatorStack.pop());
          if (operatorStack.length > 0) {o2 = operatorStack.slice(-1)[0];}
        }
        operatorStack.push(token);
      }
      //if it's a comma
      else if(token == ',') {
        // while the operator at the top of the operator stack is not a left parenthesis
        while(operatorStack.length > 0 && operatorStack.slice(-1)[0] != '(') {
          outputQueue.push(operatorStack.pop());
        }
      }
      //if it's a left parenthesis "("
      else if(token == '(') {
        //push it onto the operator stack
        operatorStack.push(token);
      }
        // if it's a right parenthesis ")"
      else if(token == ')') {
        // while the operator at the top of the operator stack is not a left parenthesis
        while(operatorStack.length > 0 && operatorStack.slice(-1)[0] != '(') {
          //TODO: assert operatorStack is not empty (already did that?)
          //pop the operator into the output queue
          outputQueue.push(operatorStack.pop());
        }
        //assert there is a left parenthesis at the top of the operator stack
        // pop the left parenthesis from the operator stack and discard it
        if(operatorStack.length > 0 && operatorStack.slice(-1)[0] == '(') {
          operatorStack.pop();
        }
        else {
          print("Problem! There is not a left parenthesis at the top of the operatorStack!");
          return;
        }

        //if there is a function token at the top of the operator stack, then pop the function from the operator stack into the output queue
        if(operatorStack.length > 0 && functions.includes(operatorStack.slice(-1)[0])) {
          outputQueue.push(operatorStack.pop());
        }
      }
    }

    // while there are tokens on the operator stack
    for (let operator of operatorStack) {
      // assert operator isn't left parenthesis
      if(operator == '(') {
        print("mismatched parentheses!");
        return;
      }
      // pop the operator onto the output queue
      outputQueue.push(operator);
    }

    return outputQueue;
  }

  // return an integer precedence level
  static precedence(operator) {
    if (operator == '^') { return 4; }
    if (operator == '*') { return 3; }
    if (operator == '/') { return 3; }
    if (operator == '+') { return 2; }
    if (operator == '-') { return 2; }
    else { print("Not a valid operator: " + operator); }
  }

  // return true if the operator is left associative
  static assocLeft(operator) {
    if (operator == '^') { return false; }
    if (operator == '*') { return true; }
    if (operator == '/') { return true; }
    if (operator == '+') { return true; }
    if (operator == '-') { return true; }
    else { print("Not a valid operator"); }
  }
  
}
  
  