"use strict"

console.log("app.js funkar")

const alphabetMain = createAlphabet()
const possibleAnswers = createAlphabet()

document.body.onload = () => {
    addSuggestions()

    // TODO: Snygga till nedan, så att "a" blir förvalt och/eller gör så man kan loopa runt alfabetet
    document.querySelectorAll(".letterCard").forEach((sak) => {
        if (sak.children[0].textContent === "a") {
            sak.click()
        }
    })
}