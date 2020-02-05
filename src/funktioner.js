"use strict"

function randomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function createAlphabet(lang = "en") {
    const alphabet = []
    let specialCharCodes = []
    switch (lang) {
        case "en":
            for (let i = 0; i < 26; i++) {
                const currentLetter = String.fromCharCode(i + 97)
                alphabet.push(currentLetter)
            }
            break
        case "sv":
            for (let i = 0; i < 26; i++) {
                const currentLetter = String.fromCharCode(i + 97)
                alphabet.push(currentLetter)
            }
            specialCharCodes = [229, 228, 246]
            for (const char of specialCharCodes) {
                alphabet.push(String.fromCharCode(char))
            }
            break
        case "nkDk":
            for (let i = 0; i < 26; i++) {
                const currentLetter = String.fromCharCode(i + 97)
                alphabet.push(currentLetter)
            }
            specialCharCodes = [230, 248, 229]
            for (const char of specialCharCodes) {
                alphabet.push(String.fromCharCode(char))
            }
            break
        case "num":
            for (let i = 0; i < 26; i++) {
                alphabet.push(i.toString())
            }
            break
    }

    if (document.querySelector(".case").checked) {
        return alphabet.map(elt => elt.toUpperCase())
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
    if (keyCheck(e)) {
        const pool = document.querySelector(".pool")

        if (checkLetters(this.textContent)) {
            const winningDiv = document.querySelector(".winning")
            const children = winningDiv.children
            const maxAnswerShowing = 5
            if (children.length > maxAnswerShowing) {
                for (let i = 0; i < children.length - maxAnswerShowing; i++) {
                    children[i].style.display = "none"
                }
            }
            winningDiv.append(this)
            this.removeEventListener("click", mainLoop)
            this.setAttribute("tabindex", "-1")
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

function keyCheck(e) {
    return e.key === "Enter" || e.type === "click" ||
        e.type === "change" && e.target.tagName === "SELECT" ? true : false
}

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
        document.querySelector(".end").style.display = "block"
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
    const previousLetter = getLastWinningLetter()
    if (previousLetter) {
        letterToCheck = letterToCheck

        //Kontrollerar mot huvud-arrayen med bokstäver då det gör att man kan använda sig av olika alfabet utan att ändra kontrollen
        return alphabetMain.indexOf(previousLetter) === alphabetMain.indexOf(letterToCheck) - 1
    } else {
        return true
    }
}

function refresh(e) {
    if (keyCheck(e)) {
        // location.reload()
        clearElementContent(".winning")
        updateAlphabets()
        addSuggestions()
        chooseFirst(alphabetMain)
    }
}

function updateAlphabets() {
    const lang = document.querySelector(".langSelector").value
    alphabetMain = createAlphabet(lang)
    possibleAnswers = createAlphabet(lang)
}

function chooseFirst(alphabetMain) {
    document.querySelectorAll(".letterCard").forEach((sak) => {
        if (sak.children[0].textContent === alphabetMain[0]) {
            sak.click()
        }
    })
}