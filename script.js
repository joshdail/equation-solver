import { parseEquationFromInput } from "./calc.js"

const button = document.getElementById("button")
const input = document.getElementById("input")
const answer = document.getElementById("answer")

function handleUserInput() {
  answer.textContent = `${parseEquationFromInput(input.value)}`
}

button.addEventListener("click", e => {
  e.preventDefault()
  handleUserInput()
})

document.addEventListener("keyup", e => {
  e.preventDefault()
  if (e.key === "Enter") {
    handleUserInput()
  }
})
