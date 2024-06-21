import { menuArray } from "./data.js"

const menuList = document.getElementById("list-element");
const orderFooter = document.getElementById("order-footer")
const itemList = document.getElementById("item-list")
const totalPrice = document.getElementById("total-price")
const checkOutBtn = document.getElementById("complete-order-btn")
const modalForm = document.getElementById("modal").children[0]
const afterpayMessage = document.getElementById("afterpay-message-container")
const discountEl = document.getElementById("discount")
const stars = document.getElementsByClassName("star");

let orderArray = []

function ItemObject(price, id){
    this.price = price;
    this.id = id
    return this
}


generateMenu()

function generateMenu(){

    addItemsToMenu(menuArray)

    const menuButtons = document.querySelectorAll(".add-btn");
    
    for(let btn of menuButtons){    
        btn.addEventListener("click" , addItemsToOrder)
    }

}

function addItemsToMenu(menuArray){
    let listItem = ``

    menuArray.forEach(menuItem => { 
        listItem+=`
        <li class="spacing-menu">
        <div class="menu-item-container">
            <i>${menuItem.emoji}</i>
            <div>
                <span class="title-span">${menuItem.name}</span>
                <p class="ingredient-list">${menuItem.ingredients.join(", ")}</p>
                <span class="price-span">$${menuItem.price}</span>
            </div>
        </div>
        <button class="add-btn" data-id="${menuItem.id}">+</button>
        </li>`
    })

    menuList.innerHTML = listItem;
}


function addItemsToOrder(){
    const itemObject = menuArray.filter(menuItem=>
        menuItem.id == this.dataset.id)[0]

    if(orderFooter.className === "hidden")
        orderFooter.classList.toggle("hidden")

    const childArray = [...itemList.children]

    const duplicateItem = childArray.find((child) => 
        child.dataset.id === this.dataset.id)

    if(!duplicateItem){{
        createItem(this, itemObject) 
        addDiscount(checkDiscount(orderArray))
    }     
    }else{
        ModifyDuplicate(duplicateItem.children[0], itemObject)
        addDiscount(checkDiscount(orderArray))
    }
}

function ModifyDuplicate(duplicate, itemObject, isDecrementing=false){
        let duplicateText = duplicate.innerHTML
        const indexOfCount = duplicateText.indexOf('x')+1

        let substring = duplicateText.substring(indexOfCount)
        const buttonSubString = substring.substring(substring.indexOf('<'))

        if(!isDecrementing)
        substring = Number(substring.
            substring(0, substring.indexOf('<')))+1
        else
            substring = Number(substring.
                substring(0, substring.indexOf('<')))-1

        const count = Number(substring)
        
        substring+=buttonSubString

        duplicateText = duplicateText.split('x')[0] + "x " + substring
        duplicate.innerHTML = duplicateText

        if(count ===1)
            duplicate.children[0].addEventListener("click", removeItem);
        else
            duplicate.children[0].addEventListener("click", removeDuplicate);

        if(itemObject){
            orderArray.push(new ItemObject(itemObject.price, itemObject.id))
            recalculateTotal(orderArray)
        }
}

function createItem(btn, itemObject){
    const itemContainer = document.createElement("li")
    itemContainer.classList+="space-between"
    itemContainer.dataset.id = btn.dataset.id;

    const newItemInList = document.createElement("li")
    newItemInList.classList+="title-span"
    newItemInList.textContent = `${itemObject.name} x 1`
    
    const removeBtn = document.createElement("button")
    removeBtn.classList+="remove-btn"
    removeBtn.textContent = "remove"

    removeBtn.addEventListener("click", removeItem)

    newItemInList.appendChild(removeBtn)
    itemContainer.appendChild(newItemInList)

    const newPriceInList = document.createElement("li")
    newPriceInList.classList+="price-span"
    newPriceInList.textContent = `$${itemObject.price}`

    itemContainer.appendChild(newPriceInList)

    itemList.appendChild(itemContainer)

    orderArray.push(new ItemObject(itemObject.price, itemObject.id))
    recalculateTotal(orderArray)
}


function removeItem(){
    const removedItemObject = new ItemObject(Number(this.parentElement.parentElement.children[1].textContent.substring(1)),
    this.parentElement.parentElement.dataset.id)
    this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement)

    console.log(removedItemObject)


    let hasPriceBeenFound = false
    orderArray = orderArray.filter(function(orderItem){
        if(orderItem.price == removedItemObject.price && 
        orderItem.id == removedItemObject.id && !hasPriceBeenFound){
            hasPriceBeenFound = !hasPriceBeenFound;
            return 0;
        }
        return 1
    })
    addDiscount(checkDiscount(orderArray))

    try{
        recalculateTotal(orderArray)
    }catch(err){
        orderFooter.classList.toggle("hidden")
    }
}

function removeDuplicate(){
    const removedItemObject = new ItemObject(Number(this.parentElement.parentElement.children[1].textContent.substring(1)),
    this.parentElement.parentElement.dataset.id)

    let hasPriceBeenFound = false
    orderArray = orderArray.filter(function(orderItem){
        if(orderItem.price == removedItemObject.price && 
            orderItem.id == removedItemObject.id && !hasPriceBeenFound){
                hasPriceBeenFound = !hasPriceBeenFound;
            return 0;
        }
        return 1
    })

    addDiscount(checkDiscount(orderArray))

    recalculateTotal(orderArray)

    const duplicate = this.parentElement
    ModifyDuplicate(this.parentElement, null, true)
}


function recalculateTotal(orderArray){   
    let pricesArray = orderArray.map(orderObject => orderObject.price) 
    pricesArray = [...pricesArray, ...checkDiscount(orderArray)]

    totalPrice.textContent = `$${(pricesArray.reduce((total, price) =>  total + price)).toFixed(2)}`
}

function checkDiscount(orderArray){
    const drinkArray = orderArray.filter(orderObject => orderObject.id === 2)
    const foodArray = orderArray.filter(orderObject => orderObject.id !== 2)
    const n = Math.min(drinkArray.length, foodArray.length)

    let discountArray = []
    for(let i=0; i<n; i++){
        discountArray[i] = -(0.15*(drinkArray[i].price + foodArray[i].price))
    }
    return discountArray
}

function addDiscount(discountArray){
    if(discountArray.length > 0){
        if(discountEl.classList.contains("hidden")){
            discountEl.classList.toggle("hidden");
            discountEl.classList.toggle("space-between");
        }

        discountEl.children[1].textContent = `-$${(-1*discountArray.
        reduce((total, discount) => total+discount)).toFixed(2)}`
        
    }else if(!discountEl.classList.contains("hidden")){
        discountEl.classList.toggle("hidden");
        discountEl.classList.toggle("space-between");
    }

}

for(let star of stars)
    star.addEventListener("click", starRating)

function starRating(){
    remove();
    for(let i=0; i<this.dataset.number; i++)
        stars[i].className = "star yellow"
}

function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}



checkOutBtn.addEventListener("click", 
    function() {
        document.getElementById("modal").classList.toggle("hidden")
        this.disabled = !this.disabled
        document.body.scrollTop = document.documentElement.scrollTop = 0
});




modalForm.addEventListener("submit", function(e){
        e.preventDefault()
        modalForm.parentElement.classList.toggle("hidden")
        orderFooter.classList.toggle("hidden")
        afterpayMessage.classList.toggle("hidden")
        window.scrollTo(0, document.body.scrollHeight);
        checkOutBtn.disabled = !checkOutBtn.disabled

        for(let button of document.getElementsByClassName("add-btn"))
            button.disabled = !button.disabled
})


