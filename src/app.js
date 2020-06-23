"use strict"

console.log("app.js funkar")

let msg = new SpeechSynthesisUtterance()
msg.lang = "sv-SE"

let alphabetMain = createAlphabet()
let possibleAnswers = createAlphabet()

document.body.onload = () => {

    addSuggestions()
    chooseFirst(alphabetMain)

    document.querySelectorAll(".reload").forEach((element) => {
        element.addEventListener("click", refresh)
        element.addEventListener("keydown", refresh)
    })

    document.querySelector(".langSelector").addEventListener("change", refresh)
    document.querySelectorAll("input[type=checkbox]").forEach(element => {
        element.addEventListener("click", refresh)
        element.addEventListener("keydown", refresh)
    })
    document.querySelector(".maxNum").addEventListener("keydown", refresh)
    document.querySelector(".numberOfSuggestions").addEventListener("keydown", refresh)

    document.querySelector(".menuCaret").addEventListener("click", hideElement)
    document.querySelector(".menuCaret").addEventListener("keydown", hideElement)
}