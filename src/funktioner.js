"use strict"

function randomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function createAlphabet(lang = "en") {
    let alphabet = []
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
            const maxNum = Math.round(document.querySelector(".maxNum").value)
            for (let i = 0; i < maxNum; i++) {
                alphabet.push(i.toString())
            }
            break
    }

    //FIXME: snygga till nedan!
    if (lang === "num") {
        document.querySelectorAll(".buttons label").forEach((element) => {
            if (element.getAttribute("for") !== "lang" && element.getAttribute("for") !== "numberOfSuggestions") {
                if (element.getAttribute("for") === "maxNum") {
                    element.classList.remove("hidden")
                } else {
                    element.classList.add("hidden")
                }
            }
        })
    } else {
        document.querySelectorAll(".buttons label").forEach((element) => {
            if (element.getAttribute("for") !== "lang" && element.getAttribute("for") !== "numberOfSuggestions") {
                if (element.getAttribute("for") !== "maxNum") {
                    element.classList.remove("hidden")
                } else {
                    element.classList.add("hidden")
                }
            }
        })
    }
    //FIXME: snygga till ovan!

    if (document.querySelector(".case").checked) {
        alphabet = alphabet.map(elt => elt.toUpperCase())
    }
    if (document.querySelector(".reversed").checked) {
        alphabet = alphabet.reverse()
    }

    return alphabet
}

function createLetterCard(letter = "a") {
    const div = document.createElement("div")
    const span = document.createElement("span")
    span.textContent = letter
    span.className = "letter"

    div.className = "letterCard firstShowing"
    div.addEventListener("animationend", (e) => e.target.classList.remove("firstShowing"))
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
                this.blur()
            })

            pool.dataset.tries = +pool.dataset.tries + 1
            if (+pool.dataset.tries === pool.children.length - 1) {
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
        let numberOfAlternatives = document.querySelector(".numberOfSuggestions").value - 1 // - 1 because the user chooses the total amount of suggestions while we need the number of false suggestions
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
        document.querySelector(".end").style.display = "flex"
    }
}

function shuffleArray(startingArray, returningArray = []) {
    if (startingArray.length > 0) {
        const postToBeMoved = startingArray[randomBetween(0, startingArray.length - 1)]
        startingArray.splice(startingArray.indexOf(postToBeMoved), 1)
        returningArray.push(postToBeMoved)
        return shuffleArray(startingArray, returningArray)
    } else {
        return returningArray
    }
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
        document.querySelector(".end").style.display = "none"
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

function toBoolean(string) {
    return string === "true" ? true : false
}

function hideElement(event) {
    if (keyCheck(event)) {
        const elementToChange = event.target.parentElement
        const stateSettingAttribute = "aria-hidden"
        const newState = !toBoolean(elementToChange.getAttribute(stateSettingAttribute))
        elementToChange.setAttribute(stateSettingAttribute, newState)

        if (elementToChange.classList.contains("menu")) {
            const caret = document.querySelector(".menuCaret")
            const toAnimationClass = newState ? "hideCaret" : "showCaret"
            const fromAnimationClass = !newState ? "hideCaret" : "showCaret"
            caret.classList.add(toAnimationClass)
            caret.classList.remove(fromAnimationClass)
        }

    }
}