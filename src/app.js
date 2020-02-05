"use strict"

console.log("app.js funkar")


let alphabetMain = createAlphabet()
let possibleAnswers = createAlphabet()

document.body.onload = () => {


    addSuggestions()
    chooseFirst(alphabetMain)

    document.querySelector(".reload").addEventListener("click", refresh)
    document.querySelector(".reload").addEventListener("keydown", refresh)

    // TEST
    document.querySelector(".buttons").addEventListener("click", () => {
        console.log("testevent funkar")
        // document.querySelector(".end").style.display = "block"

        // for (let i = 0; i < 300; i++) {
        //     console.log(String.fromCharCode(i) + ` från i = ${i}`)
        // }

    })

    document.querySelector(".langSelector").addEventListener("change", refresh)
}