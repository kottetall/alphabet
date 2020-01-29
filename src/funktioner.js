"use strict"

function randomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function createAlphabet(lang = "en") {
    const alphabet = []
    switch (lang) {
        case "en":
            for (let i = 0; i < 26; i++) {
                const currentLetter = String.fromCharCode(i + 97)
                alphabet.push(currentLetter)
            }
            break
    }
    return alphabet
}

function createLetterCard(letter = "a") {
    const div = document.createElement("div")
    const span = document.createElement("span")
    span.textContent = letter
    span.className = "letter"

    div.className = "letterCard"
    div.addEventListener("click", mainLoop)
    div.addEventListener("keydown", mainLoop)
    div.setAttribute("tabindex", "0")

    div.append(span)
    document.querySelector(".pool").append(div)
}

function mainLoop(e) {
    if (e.key === "Enter" || e.type === "click") {
        const pool = document.querySelector(".pool")

        if (checkLetters(this.textContent)) {
            document.querySelector(".winning").append(this)
            this.removeEventListener("click", mainLoop)
            addSuggestions()
            pool.dataset.tries = 0
        } else {
            this.classList.add("wrong")
            this.addEventListener("animationend", () => {
                this.classList.remove("wrong")
            })
            this.blur()

            pool.dataset.tries = +pool.dataset.tries + 1
            if (+pool.dataset.tries === 3) {
                helperMode()
            }
        }
    }
}

// *** TESTSAK ***
// document.querySelector(".test").addEventListener("click", addSuggestions)
// document.querySelector(".testTva").addEventListener("click", clearElementContent)
// *** TESTSAK ***

function helperMode() {
    const choices = document.querySelectorAll(".pool .letterCard")
    for (const choice of choices) {
        if (checkLetters(choice.children[0].textContent)) {
            choice.classList.add("highlight")
        } else {
            choice.classList.add("obscure")
        }
    }
}

function clearElementContent(locator) {
    const parent = document.querySelector(locator)
    const elementsToRemove = [...parent.children]

    for (let i = 0; i < elementsToRemove.length; i++) {
        parent.removeChild(elementsToRemove[i])
    }
}

function addSuggestions() {
    clearElementContent(".pool")

    if (document.querySelectorAll(".winning .letterCard").length !== alphabetMain.length) {
        let numberOfAlternatives = 3 // not counting the right answer
        const rightAnswer = alphabetMain[alphabetMain.indexOf(getLastWinningLetter()) + 1]

        const suggestions = [rightAnswer]
        possibleAnswers.splice(possibleAnswers.indexOf(rightAnswer), 1)

        if (numberOfAlternatives > possibleAnswers.length) {
            numberOfAlternatives = possibleAnswers.length
        }

        for (let i = 0; i < numberOfAlternatives; i++) {

            let randomIndex = randomBetween(0, possibleAnswers.length - 1)

            let counter = 0
            while (suggestions.includes(possibleAnswers[randomIndex]) && counter !== 100) {
                randomIndex = randomBetween(0, possibleAnswers.length - 1)
                counter++
            }
            suggestions.push(possibleAnswers[randomIndex])

        }

        const suggestionsRandomized = shuffleArray(suggestions)
        for (const suggestion of suggestionsRandomized) {
            createLetterCard(suggestion)
        }
    } else {
        console.log("Grattis!")
    }
}

function shuffleArray(startingArray) {

    const shuffledArray = []
    let counter = 0
    while (startingArray.length !== shuffledArray.length && counter !== 50) {
        const randomIndex = randomBetween(0, startingArray.length - 1)

        if (!shuffledArray.includes(startingArray[randomIndex])) {
            shuffledArray.push(startingArray[randomIndex])
        }
        counter++
    }
    return shuffledArray
}

function getLastWinningLetter() {
    const letters = document.querySelectorAll(".winning .letter")
    if (letters.length !== 0) {
        return letters[letters.length - 1].textContent
    } else {
        return ""
    }
}

function checkLetters(letterToCheck) {
    const previousLetter = getLastWinningLetter().toLowerCase()
    if (previousLetter) {
        letterToCheck = letterToCheck.toLowerCase()

        //Kontrollerar mot huvud-arrayen med bokstäver då det gör att man kan använda sig av olika alfabet utan att ändra kontrollen
        return alphabetMain.indexOf(previousLetter) === alphabetMain.indexOf(letterToCheck) - 1
    } else {
        return true
    }
}