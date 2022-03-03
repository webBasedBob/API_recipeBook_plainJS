'use strict'
//renamed vars
let randomSearchPanel = document.getElementById("randomSearchPanel")
let fridgeSearchPanel = document.getElementById("fridgeSearchPanel")
let resultsAreaRand = document.getElementById("resultsAreaRand")
let popUpContent = document.getElementById("popUpContent")
let resultsAreaFridge = document.getElementById("resultsAreaFridge")
let savedRecipesArea = document.getElementById("savedRecipesArea")
let tags = document.getElementById("tag");
let userIngredients = document.getElementById("userIngredients");

let key = `65d0c224750644fc89eeaec6a8dcda5f`;
// let key = "e295ac705d884295b9433b15cc133baf"

//vars needed for caching/avoiding useless fetching
let fetchResultRand
let fetchResultFridge

let requestType = "random"

//used to expand results
let randRecipeNames
let fridgeRecipeNames

//vars used to save recipes as favorites
let savedRecipes = []
const currentRecipeRand = {}
const currentRecipeFridge = {}

userIngredients.addEventListener("focus", function(){
    userIngredients.placeholder = "Separated by 1 space"
})
userIngredients.addEventListener("blur", function(){
    userIngredients.placeholder = "Keywords..."
})
document.getElementById("mainBarRandBtn").addEventListener("click", function(){
    requestType = "random"
    randomSearchPanel.style.display = "block"
    fridgeSearchPanel.style.display = "none"
    resultsAreaRand.style.display = "grid"
    resultsAreaFridge.style.display = "none"
    savedRecipesArea.style.display = "none"
})

document.getElementById("mainBarFridgeBtn").addEventListener('click', function(){
    requestType = "fridge"
    randomSearchPanel.style.display = "none"
    fridgeSearchPanel.style.display = "block"
    resultsAreaFridge.style.display = "grid"
    resultsAreaRand.style.display = "none"
    savedRecipesArea.style.display = "none"
})

document.getElementById("max").addEventListener("click", function (){
    document.getElementById("min").checked = false
})

document.getElementById("min").addEventListener("click", function (){
    document.getElementById("max").checked = false
})

document.getElementById("generateRandRecipeBtn").addEventListener('click', function(){//random recipe gen btn
    let tag = tags.value
    let numberOfRecipes = Math.trunc(document.getElementById("recipesNumberRand").value)
    let url = `https://api.spoonacular.com/recipes/random?apiKey=${key}&number=${numberOfRecipes}&tags=${tag}`
    getRecipe(url, numberOfRecipes, "resultsAreaRand")})

document.getElementById('generateFridgeRecipeBtn').addEventListener('click', function() {//whats in my fridge recipe gen btn
    let ingredientsFinal = userIngredients.value.replace(/ /g, ",+")
    let numberOfRecipes = Math.trunc(document.getElementById("recipesNumberFridge").value)
    let url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${key}&ignorePantry=${document.getElementById("ignorePantry").checked}&ranking=${(document.getElementById("min").checked) ? 2: 1}&ingredients=${ingredientsFinal}&number=${numberOfRecipes}`
    getRecipe(url, numberOfRecipes, "resultsAreaFridge")
})

resultsAreaFridge.addEventListener("click", function(){
    expandFridgeRecipe(event)
})

resultsAreaRand.addEventListener('click', function(){expandRandRecipe(event)})//popUP  recipe

document.getElementById("extBtn").addEventListener("click", function(){
    document.getElementById("popUpWrapper").style.display = "none"
})

document.getElementById("saveRecipeBtn").addEventListener("click", function(){
    saveRecipe()
})

document.getElementById('favorites').addEventListener("click", function (){
    requestType = "favorites"
    savedRecipesArea.innerHTML = ""
    randomSearchPanel.style.display = "none"
    fridgeSearchPanel.style.display = "none"
    resultsAreaRand.style.display = "none"
    resultsAreaFridge.style.display = "none"
    savedRecipesArea.style.display = "grid"
    displaySavedrecipes()
})

savedRecipesArea.addEventListener("click", function(){
    expandSavedRecipes(event)
})

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

function getRecipe (url, numberOfRecipes, resultsContainerId){
    fetch(url)
    .then(response => response.json())
    .then(jsonResponse => {
        let result = ((requestType =="random") ? jsonResponse.recipes :jsonResponse)
        if (requestType == "random"){
            fetchResultRand= result
        }else{
            fetchResultFridge = result
        }
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
        if (requestType == "random"){
            randRecipeNames = recipeNames
        }else{
            fridgeRecipeNames = recipeNames
        }
        resultsContainer.style.gridTemplateColumns = ''
        if(numberOfRecipes<3){
            resultsContainer.style.gridTemplateColumns = `repeat(${numberOfRecipes}, 30vw)`
        }else{
            resultsContainer.style.gridTemplateColumns = `repeat(3, 1fl)`
        }
    })
}

function saveRecipe (){
    let checkRecipeExistence = 0
    if (savedRecipes.length > 0){
        for (let index = 0; index< savedRecipes.length;index++){
            let savedTitle = Object.values(savedRecipes[index])[3]
            let currentTitle = ((requestType =="random") ? ( Object.values(currentRecipeRand)[3]) : (Object.values(currentRecipeFridge)[3]))
            if (savedTitle == currentTitle){
                checkRecipeExistence++
            }
        }
    }
    if(checkRecipeExistence==0){
        const currentRecipeClone = {...(requestType == "random")? currentRecipeRand: currentRecipeFridge}
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
            savedRecipesArea.style.gridTemplateColumns = `repeat(3, 1fl)`
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
    if (requestType == "random"){
        currentRecipeRand.ingredients = storedIngredients
    }else{
        currentRecipeFridge.ingredients = storedIngredients
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
            currentRecipeFridge.ingredients.push([value[currentIndex][test][index].amount, value[currentIndex][test][index].unit, value[currentIndex][test][index].name])
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
        currentRecipeRand.steps.push(value[currentIndex].analyzedInstructions[0].steps[index].step)
    }
}

function appendSteps2 (value, parentId){
    let parent = document.getElementById(parentId)
        for (let index = 0; index<value[0].steps.length;index++){
            let step = document.createElement('li')
            step.innerText = value[0].steps[index].step
            parent.append(step)
            currentRecipeFridge.steps.push(value[0].steps[index].step)
        }
}
function showPopUp () {
    document.getElementById("popUpWrapper").style.padding = "20px"
    document.getElementById("popUpWrapper").style.display = "block"
}

function expandRandRecipe (event){
    currentRecipeRand.ingredients=[]
    currentRecipeRand.steps = []
    let currentIndex = event.target.classList[0]
    currentRecipeRand.img = fetchResultRand[currentIndex].image
    currentRecipeRand.title = fetchResultRand[currentIndex].title
    popUpContent.innerHTML = ""
    appendText("h1", randRecipeNames[event.target.classList[0]], popUpContent, "")
    appendText("h3", "Ingredients list:", popUpContent, "")
    appendGen("div", popUpContent, "ingredientsListRand")
    ingredientsAppendPush(fetchResultRand
    , "ingredientsListRand", currentIndex, "extendedIngredients")
    appendText("h3", "Preparation steps:", popUpContent, "")
    appendGen("ol", popUpContent, "prepSteps")
    appendSteps(fetchResultRand
    , "prepSteps", currentIndex)
    showPopUp()
    }

function expandFridgeRecipe(event){
    currentRecipeFridge.ingredients= []
    currentRecipeFridge.steps = []
    let currentIndex = event.target.classList[0]
    currentRecipeFridge.img = fetchResultFridge[currentIndex].image
    currentRecipeFridge.title = fetchResultFridge[currentIndex].title
    popUpContent.innerHTML = ""
    appendText("h1", fridgeRecipeNames[event.target.classList[0]], popUpContent, "")
    appendText("h3", "Missing ingredients:", popUpContent, "")
    appendGen("div", popUpContent, "missingIngrList")
    ingredientsAppendPush(fetchResultFridge, "missingIngrList", currentIndex, "missedIngredients",)
    appendText("h3", "You already have:", popUpContent, "")
    appendGen("div", popUpContent, "alreadyHaveIngrList")
    ingredientsAppendNoPush(fetchResultFridge, "alreadyHaveIngrList", currentIndex, "usedIngredients")
    appendText("h3", "Unused Ingredients:", popUpContent, "")
    appendGen("div", popUpContent, "unusedIngrList")
    ingredientsAppendNoPush(fetchResultFridge, "unusedIngrList", currentIndex, "unusedIngredients")
    fetch(`https://api.spoonacular.com/recipes/${fetchResultFridge[currentIndex].id}/analyzedInstructions?apiKey=${key}`)
    .then(response => response.json())
    .then(lastResponse => {
        appendText("h3", "Preparation Steps:", popUpContent, "")
        appendGen("ol", popUpContent, "prepSteps")
        appendSteps2(lastResponse, "prepSteps")
    })
    showPopUp()
}
