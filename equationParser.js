class EquationParser {

  static digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  static allowedChars = ['z', 'e', 'i', '(', ')'];
  static operators = ['+', '-', '*', '/', '^']
  // conj - complex conjugate, arg - angle, mod - |z|, log - ln(z)
  static functions = ['sqrt', 'conj', 'log', 'arg', 'mod'];
  
  static parseEquation(equation) {
    //break equation into array of parts
    equationArray = equationToArray(equation);
  
    // execute shuntingyard
    infixToPostfix(equationArray)
    
    // compute in postfix
  }

  // Input: string representing equation. Output: array with each token
  static equationToArray(equation) {
    let digits = EquationParser.digits;
    let allowedChars = EquationParser.allowedChars;
    let operators = EquationParser.operators;
    let functions = EquationParser.functions;
    
    let equationArray = [];
    let equationIndex = 0;
    
    while(equationIndex < equation.length) {
      
      let currentChar = equation.charAt(equationIndex);

      print('observing char ' + currentChar);
      
      // if a number, find end of number
      if(digits.includes(currentChar)) {
        let number = ''
        while(equationIndex < equation.length && digits.includes(currentChar)) {
          print(currentChar + ' is a number');   
          number += currentChar;
          print(number);
          equationIndex ++;
          currentChar = equation.charAt(equationIndex);
        }
        equationArray.push(number);
      }
      else if (allowedChars.includes(currentChar)) {
        print(currentChar + ' is an allowedChar');
        equationArray.push(currentChar);
        equationIndex ++;
      }
      //if it's an operator
      else if(operators.includes(currentChar)) {
        print(currentChar + ' is an operator');
        equationArray.push(currentChar);
        equationIndex ++;
      }
      // it's a string of letters. Find the end of the string
      else {
        let word = '';
        while(equationIndex < equation.length && !(digits.includes(currentChar) || allowedChars.includes(currentChar))) {
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
    
    return equationArray;
  }

  // execute shuntingyard algorithm
  static infixToPostfix(eqArray) {
    
  }
  
}
  
  