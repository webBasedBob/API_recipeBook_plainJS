'use strict'

//renamed vars
let randomSearchPanel = document.getElementById("randomSearchPanel")
let keywordsSearchPanel = document.getElementById("keywordsSearchPanel")
let ingredientsSearchPanel = document.getElementById("ingredientsSearchPanel")
let resultsAreaRand = document.getElementById("resultsAreaRand")
let resultsAreaKeywords = document.getElementById("resultsAreaKeywords")
let resultsAreaIngredients = document.getElementById("resultsAreaIngredients")
let savedRecipesArea = document.getElementById("savedRecipesArea")
let popUpContent = document.getElementById("popUpContent")

let keywordsSuggestionsWrapper = document.getElementById("keywordsSuggestionsWrapper")
let ingredientsSuggestionsWrapper = document.getElementById("ingredientsSuggestionsWrapper")

let mainBarRandBtn = document.getElementById("mainBarRandBtn")
let mainBarKeywordsBtn = document.getElementById("mainBarKeywordsBtn")
let mainBarIngredientsBtn = document.getElementById("mainBarIngredientsBtn")
let savedRecipesBtn = document.getElementById('savedRecipesBtn')

let background = document.getElementById("background")
let welcome = document.getElementById("welcomeWrapper")
let tags = document.getElementById("tag");
// let key = `65d0c224750644fc89eeaec6a8dcda5f`;
let key = "e295ac705d884295b9433b15cc133baf"
let userIngredients = document.getElementById("userIngredients");

const API_LINK = 'https://api.spoonacular.com/recipes/'

let errorMessageWrapper = document.getElementById("errorMessageWrapper")
let errorMessage = document.getElementById('errorMessage')
let errorMessageCloseBtn = document.getElementById("errorMessageCloseBtn")


//vars needed for caching/avoiding useless fetching
let fetchedResultRand
let fetchedResultKeywords
let fetchedResultIngredients

let state = "random"

//used to expand results
let randRecipeNames
let keywordsRecipeNames
let ingredientsRecipeNames

//vars used to save recipes as favorites
let savedRecipes = []
const currentRecipeRand = {}
const currentRecipeKeywords = {}
const currentRecipeIngredients = {}

let counter = 0

//close error message popup event listener
errorMessageCloseBtn.addEventListener("click", function(){
    errorMessageWrapper.style.display = "none"
})

//suggestions panels functionality
document.getElementById("ingredientsSuggestions").addEventListener("click", function (event){
    console.log(event)
        if (event.target.id !=="ingredientsSuggestions"){
            event.target.style.display = "none"
            console.log(event.target.innerText)
            userIngredients.value += ((counter==0)?`${event.target.innerText}`:` ${ event.target.innerText}`)
            counter++}
})

document.getElementById("keywordsSuggestions").addEventListener("click", function (event){
    console.log(event)
        if (event.target.id !=="keywordsSuggestions"){
            event.target.style.display = "none"
            console.log(event.target.innerText)
            tags.value = `${event.target.innerText}`}
})

//suggestions wrappers manipulation based on user behavior
tags.addEventListener("keydown", function(){
    if (event.keyCode == 8){
        if (tags.value.length ==1 && resultsAreaKeywords.innerText !==""){
            keywordsSuggestionsWrapper.style.display = "flex"
            resultsAreaKeywords.style.display = "none"
}}})

tags.addEventListener("focus", function(){
    if(tags.value ==""){
        keywordsSuggestionsWrapper.style.display = "flex"
        resultsAreaKeywords.style.display = "none"
    }
})

background.addEventListener("click", function(){
    //insert switch here
    switch(state){
        case "keywords":
            if(resultsAreaKeywords.innerText !==""){
                keywordsSuggestionsWrapper.style.display = "none"
                resultsAreaKeywords.style.display = "grid"
            }
            break
        case "ingredients":
            if(resultsAreaIngredients.innerText !==""){
                ingredientsSuggestionsWrapper.style.display = "none"
                resultsAreaIngredients.style.display = "grid"
            }
            break
        }
})

userIngredients.addEventListener("keydown", function(){
    if (event.keyCode == 8){
        if (userIngredients.value.length ==1 && resultsAreaIngredients.innerText !==""){
            ingredientsSuggestionsWrapper.style.display = "flex"
            resultsAreaIngredients.style.display = "none"

}}})

userIngredients.addEventListener("focus", function(){
    if(userIngredients.value ==""){
        ingredientsSuggestionsWrapper.style.display = "flex"
        resultsAreaIngredients.style.display = "none"
    }
})




//input fields palceholders events
userIngredients.addEventListener("focus", function(){
    userIngredients.placeholder = "Separated by 1 space"
})
userIngredients.addEventListener("blur", function(){
    userIngredients.placeholder = "Ingredients..."
})

document.getElementById("max").addEventListener("click", function (){
    document.getElementById("min").checked = false
})

document.getElementById("min").addEventListener("click", function (){
    document.getElementById("max").checked = false
})

//ingredients suggestion panel filter buttons
document.getElementById("vegetablesFilterBtn").addEventListener("click", function (){
    showIngredientsByClass(".vegetables")
    hideIngredientsByClass(".meat")
    hideIngredientsByClass(".others")
})

document.getElementById("meatFilterBtn").addEventListener("click", function (){
    showIngredientsByClass(".meat")
    hideIngredientsByClass(".vegetables")
    hideIngredientsByClass(".others")
})



document.getElementById("othersFilterBtn").addEventListener("click", function (){
    showIngredientsByClass(".others")
    hideIngredientsByClass(".meat")
    hideIngredientsByClass(".vegetables")
})

//main bar buttons functionality
mainBarRandBtn.addEventListener("click", function(){
    state = "random" 
    event.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
    mainBarKeywordsBtn.style.backgroundColor = "" 
    mainBarIngredientsBtn.style.backgroundColor = "" 
    savedRecipesBtn.style.backgroundColor = ""
    randomSearchPanel.style.display = "flex"
    keywordsSearchPanel.style.display = "none"
    ingredientsSearchPanel.style.display = "none"
    resultsAreaRand.style.display = "grid"
    resultsAreaIngredients.style.display = "none"
    savedRecipesArea.style.display = "none"
    resultsAreaKeywords.style.display = "none"
    keywordsSuggestionsWrapper.style.display = "none"
    if (resultsAreaRand.innerText == ""){
        showWelcomeUnblurrBackground()
    }else{
        hideWelcomeBlurBackground()
    }
    ingredientsSuggestionsWrapper.style.display = "none"
})

mainBarKeywordsBtn.addEventListener("click", function(){
    state = "keywords"
    event.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
    mainBarRandBtn.style.backgroundColor = ""  
    mainBarIngredientsBtn.style.backgroundColor = "" 
    savedRecipesBtn.style.backgroundColor = ""
    resultsAreaRand.style.display = "none"
    randomSearchPanel.style.display = "none"
    keywordsSearchPanel.style.display = "flex"
    ingredientsSearchPanel.style.display = "none"
    resultsAreaKeywords.style.display = "grid"
    resultsAreaIngredients.style.display = "none"
    savedRecipesArea.style.display = "none"
    if (resultsAreaKeywords.innerText == ""){
        showWelcomeUnblurrBackground()
    }else{
        hideWelcomeBlurBackground()
    }
    ingredientsSuggestionsWrapper.style.display = "none"
    // if (resultsAreaKeywords.innerText == ""){
    //     keywordsSuggestionsWrapper.style.display  = "flex"
    // }
})
mainBarIngredientsBtn.addEventListener('click', function(){
    state = "ingredients"
    this.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
    mainBarRandBtn.style.backgroundColor = "" 
    mainBarKeywordsBtn.style.backgroundColor = ""  
    savedRecipesBtn.style.backgroundColor = ""
    randomSearchPanel.style.display = "none"
    resultsAreaRand.style.display = "none"
    keywordsSearchPanel.style.display = "none"
    ingredientsSearchPanel.style.display = "flex"
    resultsAreaIngredients.style.display = "grid"
    resultsAreaKeywords.style.display = "none"
    savedRecipesArea.style.display = "none"
    if (resultsAreaIngredients.innerText == ""){
        showWelcomeUnblurrBackground()
    }else{
        hideWelcomeBlurBackground()
    }
    // if (resultsAreaIngredients.innerText == ""){
    //     ingredientsSuggestionsWrapper.style.display  = "flex"
    // }
    keywordsSuggestionsWrapper.style.display = "none"
})

savedRecipesBtn.addEventListener("click", function (){
    state = "favorites"
    event.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
    mainBarRandBtn.style.backgroundColor = "" 
    mainBarKeywordsBtn.style.backgroundColor = "" 
    mainBarIngredientsBtn.style.backgroundColor = "" 
    savedRecipesArea.innerHTML = ""
    resultsAreaRand.style.display = "none"
    randomSearchPanel.style.display = "none"
    keywordsSearchPanel.style.display = "none"
    ingredientsSearchPanel.style.display = "none"
    resultsAreaKeywords.style.display = "none"
    resultsAreaIngredients.style.display = "none"
    savedRecipesArea.style.display = "grid"
    displaySavedrecipes()
    if (savedRecipesArea.innerText == ""){
        showWelcomeUnblurrBackground()
    }else{
        hideWelcomeBlurBackground()
    }
    keywordsSuggestionsWrapper.style.display = "none"
    ingredientsSuggestionsWrapper.style.display = "none"
})

//generator buttons event listeners

document.getElementById("generateRandRecipeBtn").addEventListener('click', function(){//keywords recipe gen btn
    getRandRecipe()})


document.getElementById("generateKeywordsRecipeBtn").addEventListener('click', function(){//keywords recipe gen btn
    keywordsSuggestionsWrapper.style.display = "none"
    getKeywordsRecipe()
})

document.getElementById('generateIngredientsRecipeBtn').addEventListener('click', function() {//whats in my fridge recipe gen btn
    ingredientsSuggestionsWrapper.style.display = "none"
    getIngredientsRecipe()
})

//expand results
resultsAreaIngredients.addEventListener("click", function(){
    expandRecipeIngredients(event)
})

resultsAreaKeywords.addEventListener('click', function(){expandRecipeKeywords(event)})//popUP  recipe

resultsAreaRand.addEventListener("click", function(){
    expandRecipeRand(event)
})

savedRecipesArea.addEventListener("click", function(){
    expandSavedRecipes(event)
})

//exit button functionality
document.getElementById("extBtn").addEventListener("click", function(){
    document.getElementById("popUpWrapper").style.display = "none"
})

document.querySelector("body").addEventListener("keyup", function(event){
    if (event.keyCode == 27){
        document.getElementById("popUpWrapper").style.display = "none"
}})

//save button funcionality
document.getElementById("saveRecipeBtn").addEventListener("click", function(){
    saveRecipe()
})

//press enter to return results functionality
document.querySelector("body").addEventListener("keyup", function(event){
    if (event.keyCode == 13){
        switch (state){
            case "random":
                getRandRecipe()
                break
            case "keywords":
                keywordsSuggestionsWrapper.style.display = "none"
                getKeywordsRecipe()
                break
            case "ingredients":
                ingredientsSuggestionsWrapper.style.display = "none"
                getIngredientsRecipe()
                break
        }
    }
})

//functions

function hideWelcomeBlurBackground(){
    background.style.filter =  "blur(15px) brightness(30%)";
    welcome.style.display = "none"
}
function showWelcomeUnblurrBackground(){
    background.style.filter =  "blur(0px) brightness(30%)";
    welcome.style.display = "flex"
}
function appendText (elmType, innerText, parent, classList){
    let textElement = document.createElement(elmType)
    textElement.innerText = innerText
    textElement.classList = classList
    parent.append(textElement)
}
function appendImg (src, parent, classList) {
    let appendedImg = document.createElement("img")
    appendedImg.src = src
    appendedImg.classList = classList
    parent.append(appendedImg)
}

function appendGen (elmType, parent, id){
    let appendedDiv = document.createElement(elmType)
    appendedDiv.id = id
    parent.append(appendedDiv)
}

function checkState(source){
    if (state == "keywords"){
        fetchedResultKeywords= source
        console.log(fetchedResultKeywords)
    }else if (state == "ingredients"){
        fetchedResultIngredients = source
    } else{
        fetchedResultRand = source
        console.log(fetchedResultRand)
    }
}

function getRandRecipe (){
    let noOfRecipes = document.getElementById("recipesNumberRand")
    if (noOfRecipes.value ==""){
        errorMessage.innerText = "You have not completed the required field"
        errorMessageWrapper.style.display = 'flex'
        return
    }
    let numberOfRecipes = Math.trunc(noOfRecipes.value)
    let url = `${API_LINK}random?apiKey=${key}&number=${numberOfRecipes}`
    getRecipe(url, numberOfRecipes, "resultsAreaRand")
    hideWelcomeBlurBackground()
}

function getKeywordsRecipe (){
    let tag = tags.innerText
    let numberOfRecipes = Math.trunc(document.getElementById("recipesNumberKeywords").value)
    let url = `${API_LINK}random?apiKey=${key}&number=${numberOfRecipes}&tags=${tag}`
    getRecipe(url, numberOfRecipes, "resultsAreaKeywords")
    hideWelcomeBlurBackground()
}

function getIngredientsRecipe (){
    let ingredientsFinal = userIngredients.value.replace(/ /g, ",+").toLowerCase()
    let numberOfRecipes = Math.trunc(document.getElementById("recipesNumberIngredients").value)
    let url = `${API_LINK}findByIngredients?apiKey=${key}&ignorePantry=${document.getElementById("ignorePantry").checked}&ranking=${(document.getElementById("min").checked) ? 2: 1}&ingredients=${ingredientsFinal}&number=${numberOfRecipes}`
    getRecipe(url, numberOfRecipes, "resultsAreaIngredients")
    hideWelcomeBlurBackground()
}


function getRecipe (url, numberOfRecipes, resultsContainerId){
    fetch(url)
    .then(response => response.json())
    .then(jsonResponse => {
        let result = ((state =="ingredients") ? jsonResponse : jsonResponse.recipes)
        checkState(result)
        // if (state == "keywords"){
        //     fetchedResultKeywords= result
        //     console.log(fetchedResultKeywords)
        // }else if (state == "ingredients"){
        //     fetchedResultIngredients = result
        // } else{
        //     fetchedResultRand = result
        // }
        let resultsContainer = document.getElementById(resultsContainerId)
        resultsContainer.innerHTML = ""
        let recipeNames = []
        for (let index = 0; index<numberOfRecipes; index++){
            let container = document.createElement('div')
            resultsContainer.append(container)
            appendImg(result[index].image, container, `${index}`)
            appendText("p", result[index].title, container, `${index}`)
            recipeNames.push(result[index].title)
            container.classList = `${index}`
        }
        if (state == "keywords"){
            keywordsRecipeNames= recipeNames
        }else if (state == "ingredients"){
            ingredientsRecipeNames = recipeNames
        }else{
            randRecipeNames = recipeNames
        }
        resultsContainer.style.gridTemplateColumns = ''
        if(numberOfRecipes<3){
            resultsContainer.style.gridTemplateColumns = `repeat(${numberOfRecipes}, 30vw)`
        }else{
            console.log(screen.width)
            resultsContainer.style.gridTemplateColumns = ((screen.width<750) ? `repeat(2, 1fr)`: `repeat(3, 1fr)`)
        }
        resultsContainer.style.display = "grid"
    })
}

function saveRecipe (){
    let checkRecipeExistence = 0
    if (savedRecipes.length > 0){
        for (let index = 0; index< savedRecipes.length;index++){
            let savedTitle = Object.values(savedRecipes[index])[3]
            let currentTitle = ((state =="random") ? ( Object.values(currentRecipeRand)[3]) :(state =="keywords") ? ( Object.values(currentRecipeKeywords)[3]) : (Object.values(currentRecipeIngredients)[3]))
            if (savedTitle == currentTitle){
                checkRecipeExistence++
            }
        }
    }
    if(checkRecipeExistence==0){
        const currentRecipeClone = {...((state == "random")? currentRecipeRand : (state == "keywords")? currentRecipeKeywords: currentRecipeIngredients)}
        savedRecipes.push(currentRecipeClone)
    }
}

function displaySavedrecipes(){
    for (let index = 0; index<savedRecipes.length;index++){//iterate through storedrecpesarray to show all recipes
        let container = document.createElement("div")
        savedRecipesArea.append(container)
        appendImg(savedRecipes[index].img, container, index)//recipe img
        appendText("p", savedRecipes[index].title, container, index)//recipe title
    }
    savedRecipesArea.style.gridTemplateColumns = ''
    if(savedRecipes.length<3){
            savedRecipesArea.style.gridTemplateColumns = `repeat(${savedRecipes.length}, 30vw)`
    }else{
            savedRecipesArea.style.gridTemplateColumns = `repeat(3, 1fr)`
    }
}

function expandSavedRecipes(event){
    popUpContent.innerHTML = ""
    appendText("h1", savedRecipes[event.target.classList[0]].title, popUpContent, "")
    appendText("h3", "Ingredients list:", popUpContent, "")
    appendGen("div", popUpContent, "savedRecipePopUp")
    let savedRecipePopUp = document.getElementById("savedRecipePopUp")
    for (let index = 0; index < savedRecipes[event.target.classList[0]].ingredients.length; index++){
        let ingredient = document.createElement("p")
        ingredient.innerText = `${savedRecipes[event.target.classList[0]].ingredients[index][0]} ${savedRecipes[event.target.classList[0]].ingredients[index][1]} ${savedRecipes[event.target.classList[0]].ingredients[index][2]}`
        ingredient.style.width = "fit-content"
        savedRecipePopUp.append(ingredient)
    }
    savedRecipePopUp.style.display = "grid"
    savedRecipePopUp.style.gridTemplateColumns = `repeat(3, 30vw)`
    appendText("h3", "Preparation steps:", popUpContent, "")
    appendGen("ol", popUpContent, "prepSteps")
    let parent = document.getElementById("prepSteps")
        for (let index2 = 0; index2<savedRecipes[event.target.classList[0]].steps.length;index2++){
            let step = document.createElement('li')
            step.innerText = savedRecipes[event.target.classList[0]].steps[index2]
            parent.append(step)
        }
    showPopUp()
}

function ingredientsAppendPush (value, parentId, currentIndex, specificKey) {
    let test = specificKey
    let parent = document.getElementById(parentId)
    let storedIngredients =[]
    for (let index = 0;index <value[currentIndex][test].length;index++) {
        let ingredient = document.createElement("p")
        ingredient.innerText = `${value[currentIndex][test][index].amount} ${value[currentIndex][test][index].unit} ${value[currentIndex][test][index].name}`
        parent.append(ingredient)
        ingredient.style.width = "fit-content"
        storedIngredients.push([value[currentIndex][test][index].amount, value[currentIndex][test][index].unit, value[currentIndex][test][index].name])
        parent.style.display = "grid"
        parent.style.gridTemplateColumns = `repeat(3, 30vw)`
    }
    if(state =="random"){
        currentRecipeRand.ingredients = storedIngredients
    } else if(state == "keywords"){
        currentRecipeKeywords.ingredients = storedIngredients
    }else{
        currentRecipeIngredients.ingredients = storedIngredients
    }
}

function ingredientsAppendNoPush (value, parentId, currentIndex, specificKey){
    let test = specificKey
    let parent = document.getElementById(parentId)
    for (let index = 0;index <value[currentIndex][test].length;index++){
        let ingredient = document.createElement("p")
        ingredient.innerText = `${value[currentIndex][test][index].amount} ${value[currentIndex][test][index].unit} ${value[currentIndex][test][index].name}`
        ingredient.style.width = "fit-content"
        parent.append(ingredient)
        if (specificKey =="usedIngredients"){
            currentRecipeIngredients.ingredients.push([value[currentIndex][test][index].amount, value[currentIndex][test][index].unit, value[currentIndex][test][index].name])
        }
    }
    parent.style.display = "grid"
    parent.style.gridTemplateColumns = `repeat(3, 30vw)`
}

function appendSteps(value, parentId, currentIndex){
    let parent = document.getElementById(parentId)
    for (let index = 0; index<value[currentIndex].analyzedInstructions[0].steps.length;index++){
        let step = document.createElement('li')
        step.innerText = value[currentIndex].analyzedInstructions[0].steps[index].step
        parent.append(step)
        if (state=="random"){
            currentRecipeRand.steps.push(value[currentIndex].analyzedInstructions[0].steps[index].step)
        }else{
            currentRecipeKeywords.steps.push(value[currentIndex].analyzedInstructions[0].steps[index].step)
        }
    }
}

function appendSteps2 (value, parentId){
    let parent = document.getElementById(parentId)
        for (let index = 0; index<value[0].steps.length;index++){
            let step = document.createElement('li')
            step.innerText = value[0].steps[index].step
            parent.append(step)
            currentRecipeIngredients.steps.push(value[0].steps[index].step)
        }
}
function showPopUp () {
    document.getElementById("popUpWrapper").style.padding = "20px"
    document.getElementById("popUpWrapper").style.display = "inline-flex"
}

function expandRecipeKeywords (event){
    currentRecipeKeywords.ingredients=[]
    currentRecipeKeywords.steps = []
    let currentIndex = event.target.classList[0]
    console.log(currentIndex)
    currentRecipeKeywords.img = fetchedResultKeywords[currentIndex].image
    currentRecipeKeywords.title = fetchedResultKeywords[currentIndex].title
    popUpContent.innerHTML = ""
    appendText("h1", keywordsRecipeNames[event.target.classList[0]], popUpContent, "")
    appendText("h3", "Ingredients list:", popUpContent, "")
    appendGen("div", popUpContent, "ingredientsListKeywords")
    ingredientsAppendPush(fetchedResultKeywords, "ingredientsListKeywords", currentIndex, "extendedIngredients")
    appendText("h3", "Preparation steps:", popUpContent, "")
    appendGen("ol", popUpContent, "prepSteps")
    appendSteps(fetchedResultKeywords, "prepSteps", currentIndex)
    showPopUp()
    }

function expandRecipeRand (event){
    currentRecipeRand.ingredients=[]
    currentRecipeRand.steps = []
    let currentIndex = event.target.classList[0]
    currentRecipeRand.img = fetchedResultRand[currentIndex].image
    currentRecipeRand.title = fetchedResultRand[currentIndex].title
    popUpContent.innerHTML = ""
    appendText("h1", randRecipeNames[event.target.classList[0]], popUpContent, "")
    appendText("h3", "Ingredients list:", popUpContent, "")
    appendGen("div", popUpContent, "ingredientsListRand")
    ingredientsAppendPush(fetchedResultRand, "ingredientsListRand", currentIndex, "extendedIngredients")
    appendText("h3", "Preparation steps:", popUpContent, "")
    appendGen("ol", popUpContent, "prepSteps")
    appendSteps(fetchedResultRand, "prepSteps", currentIndex)
    showPopUp()
    } 

function expandRecipeIngredients(event){
    currentRecipeIngredients.ingredients= []
    currentRecipeIngredients.steps = []
    let currentIndex = event.target.classList[0]
    currentRecipeIngredients.img = fetchedResultIngredients[currentIndex].image
    currentRecipeIngredients.title = fetchedResultIngredients[currentIndex].title
    popUpContent.innerHTML = ""
    appendText("h1", ingredientsRecipeNames[event.target.classList[0]], popUpContent, "")
    appendText("h3", "Missing ingredients:", popUpContent, "")
    appendGen("div", popUpContent, "missingIngrList")
    ingredientsAppendPush(fetchedResultIngredients, "missingIngrList", currentIndex, "missedIngredients",)
    appendText("h3", "You already have:", popUpContent, "")
    appendGen("div", popUpContent, "alreadyHaveIngrList")
    ingredientsAppendNoPush(fetchedResultIngredients, "alreadyHaveIngrList", currentIndex, "usedIngredients")
    appendText("h3", "Unused Ingredients:", popUpContent, "")
    appendGen("div", popUpContent, "unusedIngrList")
    ingredientsAppendNoPush(fetchedResultIngredients, "unusedIngrList", currentIndex, "unusedIngredients")
    fetch(`${API_LINK}${fetchedResultIngredients[currentIndex].id}/analyzedInstructions?apiKey=${key}`)
    .then(response => response.json())
    .then(lastResponse => {
        appendText("h3", "Preparation Steps:", popUpContent, "")
        appendGen("ol", popUpContent, "prepSteps")
        appendSteps2(lastResponse, "prepSteps")
    })
    showPopUp()
}

function showIngredientsByClass(elmClass){
    let nodeList = document.querySelectorAll(elmClass)
    for (let index = 0; index<nodeList.length;index++){
        nodeList[index].style.display  = "block"
    }
}

function hideIngredientsByClass (elmClass){
    let nodeList = document.querySelectorAll(elmClass)
    for (let index = 0; index<nodeList.length;index++){
        nodeList[index].style.display  = "none"
    }
}
