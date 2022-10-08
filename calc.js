// This will only select what is inside parenthesis
const PARENTHESIS = /((?<=\()[\d\s\+\-\*\/\^\.]*(?=\)))/gi;

function removeInvalidCharacters(str) {
  // Returns null if nothing survives the filter
  return (
    str
      .trim()
      .match(/[\d\s\+\\\-\*\/\(\)\^\.]/gi)
      ?.join("") || null
  );
}

function splitEquationIntoPieces(str) {
  let arr = str.split(/(\s[\+\\\-\*\/\^])\s/gi);
  if (arr.length === 1 && isNaN(arr[0])) {
    return null;
  }
  return arr;
}

function parseNumberValues(arr) {
  const parsedArray = [];
  arr.forEach(element => {
    element = element.trim();
    if (isNaN(element)) {
      parsedArray.push(element);
    } else {
      parsedArray.push(parseFloat(element));
    }
  });
  return parsedArray;
}

function solveExponents(arr) {
  const index = arr.indexOf("^");
  if (index === -1) {
    return arr;
  }
  let result = Math.pow(arr[index - 1], arr[index + 1]);
  arr.splice(index - 1, 3, result);
  return solveExponents(arr);
}

function solveMultiplyDivide(arr) {
  const index = arr.indexOf("*") === -1 ? arr.indexOf("/") : arr.indexOf("*");
  if (index === -1) {
    return arr;
  }
  let a = arr[index - 1];
  let b = arr[index + 1];
  let result = arr[index] === "*" ? a * b : a / b;
  arr.splice(index - 1, 3, result);
  return solveMultiplyDivide(arr);
}

function solveAddSubtract(arr) {
  const index = arr.indexOf("+") === -1 ? arr.indexOf("-") : arr.indexOf("+");
  if (index === -1) {
    return arr;
  }
  let a = arr[index - 1];
  let b = arr[index + 1];
  let result = arr[index] === "+" ? a + b : a - b;
  arr.splice(index - 1, 3, result);
  return solveAddSubtract(arr)[0];
}

function handleParenthesis(str) {
  let subStr = str.match(PARENTHESIS)[0];
  str = str.replace(`(${subStr})`, `${solveEquationFromString(subStr)}`);
  return str;
}

function generateEquationArray(str) {
  const unParsedArray = splitEquationIntoPieces(str);
  return unParsedArray ? parseNumberValues(unParsedArray) : null;
}

function solveEquationFromString(str) {
  const equation = generateEquationArray(str);
  return equation ? solveEquationFromArray(equation) : NaN;
}

export function parseEquationFromInput(str) {
  let filteredStr = removeInvalidCharacters(str);
  if (!filteredStr || filteredStr.length < 1) return NaN;

  while (filteredStr.match(PARENTHESIS)) {
    filteredStr = handleParenthesis(filteredStr);
  }
  return solveEquationFromString(filteredStr);
}

function solveEquationFromArray(arr) {
  return solveAddSubtract(solveMultiplyDivide(solveExponents(arr)));
}
